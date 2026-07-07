"""
GenReview AI — NLP Engine (Section 10.3.1 of the Graphura PRD)
================================================================
Converts unstructured customer review text into structured business
intelligence, using a quantized DistilBERT (transformer-based) sentiment
model for speed on CPU-only machines:

    1. Overall sentiment            (Positive / Neutral / Negative)
    2. Aspect-based sentiment       (Food, Service, Staff, Pricing,
                                      Cleanliness, Ambience, Wait Time)
    3. Emotion detection            (Happy, Frustrated, Angry, Disappointed)
    4. Keyword & phrase extraction
    5. Complaint categorization
    6. Intent recognition           (Complaint, Suggestion, Appreciation, Inquiry)
    7. Automatic topic discovery    (LDA)
    8. Language detection           (multilingual support)

Input : yelp.csv  (business_id, date, review_id, stars, text, ...)
Output: reviews_nlp_enriched.csv + topic_summary.json

Run:  python3 nlp_engine.py
"""

import os
import re
import json
import warnings
from collections import Counter

import numpy as np
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from langdetect import detect, DetectorFactory, LangDetectException
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from tqdm import tqdm

warnings.filterwarnings("ignore")
DetectorFactory.seed = 42  # deterministic langdetect

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

for pkg in ["punkt", "punkt_tab", "stopwords"]:
    try:
        nltk.data.find(f"tokenizers/{pkg}" if "punkt" in pkg else f"corpora/{pkg}")
    except LookupError:
        nltk.download(pkg, quiet=True)

STOPWORDS = set(stopwords.words("english"))

# ----------------------------------------------------------------------
# 0. SENTIMENT MODEL  (DistilBERT, fine-tuned on SST-2, quantized for CPU)
# ----------------------------------------------------------------------
# First run downloads the model (~260 MB) from Hugging Face — needs internet.
#
# Two speed optimizations applied here, both important if you're on CPU
# (no NVIDIA GPU):
#   1. torch.set_num_threads(os.cpu_count()) — use every CPU core, not just one
#   2. Dynamic INT8 quantization — shrinks the model's linear layers to
#      8-bit weights, giving roughly a 2-4x speedup on CPU with only a
#      negligible accuracy drop. GPUs skip this (it's a CPU-only trick).

MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"
USE_GPU = torch.cuda.is_available()

if not USE_GPU:
    torch.set_num_threads(os.cpu_count())

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

if not USE_GPU:
    # Quantization only helps on CPU; on GPU this would be skipped/no-op-ish
    model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear}, dtype=torch.qint8
    )

sentiment_pipe = pipeline(
    "sentiment-analysis",
    model=model,
    tokenizer=tokenizer,
    device=0 if USE_GPU else -1,
)

# distilBERT-SST2 only outputs POSITIVE / NEGATIVE + a confidence score —
# there's no built-in "neutral" class. Below this confidence, we treat the
# call as too uncertain to trust and label it Neutral instead.
NEUTRAL_THRESHOLD = 0.65
BATCH_SIZE = 64  # raise to 128 if you have plenty of RAM, lower if you hit memory errors


def bert_sentiment(text_or_texts, show_progress=True):
    """
    Batched DistilBERT sentiment, processed in chunks with a visible
    progress bar so you can see it working (and how much is left) instead
    of the terminal looking frozen during a long run.
    Pass a single string OR a list of strings.
    Returns (label, score) for a single string, or a list of those for a
    list input. label is one of 'Positive' / 'Negative' / 'Neutral'.
    """
    single = isinstance(text_or_texts, str)
    texts = [text_or_texts] if single else text_or_texts
    if not texts:
        return [] if not single else ("Neutral", 0.0)

    labeled = []
    chunk_range = range(0, len(texts), BATCH_SIZE)
    iterator = tqdm(chunk_range, desc="Scoring sentiment", unit="batch") if (show_progress and not single) else chunk_range

    for i in iterator:
        chunk = texts[i:i + BATCH_SIZE]
        # Yelp reviews are short — 128 tokens covers the vast majority of
        # them, and is much faster than the model's full 512-token limit.
        results = sentiment_pipe(chunk, truncation=True, max_length=128)
        for r in results:
            raw_label, score = r["label"], r["score"]
            if score < NEUTRAL_THRESHOLD:
                label = "Neutral"
            else:
                label = "Positive" if raw_label == "POSITIVE" else "Negative"
            labeled.append((label, score))

    return labeled[0] if single else labeled


# ----------------------------------------------------------------------
# 1. LEXICONS  (rule-based layer for aspects / emotion / complaint /
#    intent — these are pattern-matching problems, not tasks that need a
#    neural model, so they stay lexicon-based even after swapping the core
#    sentiment engine to DistilBERT)
# ----------------------------------------------------------------------

ASPECT_KEYWORDS = {
    "Food": ["food", "meal", "dish", "taste", "tasted", "flavor", "flavour", "menu",
             "breakfast", "lunch", "dinner", "pizza", "burger", "sandwich", "sushi",
             "steak", "buffet", "appetizer", "dessert", "drink", "coffee", "cuisine",
             "entree", "gyro", "recipe", "portion"],
    "Service": ["service", "served", "serve", "server", "waiter", "waitress",
                "attentive", "order", "ordered", "waitstaff", "hostess"],
    "Staff": ["staff", "employee", "manager", "owner", "bartender", "cashier",
              "crew", "receptionist", "technician", "team"],
    "Pricing": ["price", "pricing", "expensive", "cheap", "cost", "affordable",
                "overpriced", "value", "worth", "money", "bill", "charge", "fee"],
    "Cleanliness": ["clean", "dirty", "hygiene", "mess", "messy", "spotless",
                     "sanitary", "filthy", "tidy", "smell"],
    "Ambience": ["ambience", "ambiance", "atmosphere", "decor", "décor", "music",
                 "vibe", "environment", "setting", "interior", "cozy", "noisy",
                 "crowded", "view"],
    "Wait Time": ["wait", "waited", "waiting", "queue", "line", "minutes", "delay",
                  "delayed", "slow"],
}

EMOTION_KEYWORDS = {
    "Happy": ["happy", "glad", "delighted", "pleased", "joy", "love", "loved",
              "great", "excellent", "amazing", "wonderful", "fantastic", "awesome",
              "perfect", "impressed"],
    "Frustrated": ["frustrated", "frustrating", "annoyed", "annoying", "irritated",
                   "fed up", "ridiculous", "hassle"],
    "Angry": ["angry", "furious", "outraged", "outrageous", "unacceptable", "rude",
              "disrespectful", "terrible", "horrible", "worst", "disgusted"],
    "Disappointed": ["disappointed", "disappointing", "let down", "underwhelmed",
                      "expected more", "not what i expected", "mediocre", "meh"],
}

COMPLAINT_CATEGORY_KEYWORDS = {
    "Service Delay": ["wait", "waited", "waiting", "slow service", "took forever",
                       "long time", "queue", "line"],
    "Food Quality": ["cold food", "bland", "undercooked", "overcooked", "tasteless",
                      "stale", "burnt", "soggy"],
    "Staff Behavior": ["rude", "unprofessional", "ignored", "dismissive", "attitude",
                        "disrespectful"],
    "Pricing Issue": ["overpriced", "expensive", "hidden charge", "rip off",
                       "ripoff", "overcharged"],
    "Cleanliness Issue": ["dirty", "messy", "unhygienic", "filthy", "smell", "roach",
                            "bug"],
    "Product/Service Quality": ["broken", "defective", "damaged", "poor quality",
                                  "faulty", "malfunction"],
}

SUGGESTION_PATTERNS = [
    r"\bshould\b", r"\bcould\b", r"\bit would be (nice|better|great) if\b",
    r"\bi (recommend|suggest)\b", r"\bwish (they|it)\b", r"\bhope (they|it)\b",
    r"\bplease (add|consider|bring back)\b",
]
QUESTION_STARTERS = ("does", "is", "are", "can", "could", "would", "will",
                      "how", "what", "why", "when", "where", "who", "should",
                      "wondering", "anyone know")

CONTRAST_SPLIT = re.compile(
    r"\b(but|however|although|though|whereas|yet|except that|on the other hand)\b",
    flags=re.IGNORECASE)

ASPECT_LIST = list(ASPECT_KEYWORDS.keys())


def contains_any(text_lower, keywords):
    return any(kw in text_lower for kw in keywords)


def split_into_clauses(text):
    """Sentence-tokenize, then further split each sentence on contrastive
    conjunctions ('but', 'however', ...) so that mixed-sentiment sentences
    like 'Food was great, but service was slow' score each half correctly
    instead of averaging into a false positive/negative."""
    try:
        sentences = sent_tokenize(text)
    except Exception:
        sentences = [text]
    clauses = []
    for sent in sentences:
        parts = CONTRAST_SPLIT.split(sent)
        clauses.extend([p.strip() for p in parts if p and not CONTRAST_SPLIT.fullmatch(p.strip())])
    return [c for c in clauses if c]


# ----------------------------------------------------------------------
# 2. LANGUAGE DETECTION
# ----------------------------------------------------------------------

def detect_language(text):
    try:
        sample = text[:200].strip()
        if len(sample) < 3:
            return "unknown"
        return detect(sample)
    except LangDetectException:
        return "unknown"


# ----------------------------------------------------------------------
# 3. OVERALL SENTIMENT  (DistilBERT)
# ----------------------------------------------------------------------

def overall_sentiment(text):
    """Single-review convenience wrapper. Prefer overall_sentiment_batch()
    when scoring many reviews — it's much faster."""
    label, score = bert_sentiment(text)
    signed_score = score if label == "Positive" else (-score if label == "Negative" else 0.0)
    return label, signed_score


def overall_sentiment_batch(texts):
    """Vectorized overall sentiment for a list of reviews — batches all of
    them through DistilBERT together instead of one call per review."""
    results = bert_sentiment(texts)
    return [
        (label, score if label == "Positive" else (-score if label == "Negative" else 0.0))
        for label, score in results
    ]


# ----------------------------------------------------------------------
# 4. ASPECT-BASED SENTIMENT  (DistilBERT, batched across the whole corpus)
# ----------------------------------------------------------------------

def aspect_sentiment_batch(texts):
    """
    Aspect-based sentiment for a whole list of reviews, batched for speed:
      1. Pull out every clause across every review that mentions an aspect
      2. Score all of those clauses in ONE batched DistilBERT call
      3. Map scores back to (review, aspect) and aggregate (majority vote)
    Returns a list of dicts, one per review, each shaped like:
      {"Food": "Positive", "Service": "Negative", ..., "Overall (aspect-weighted)": "Mixed"}
    """
    per_review_clauses = [split_into_clauses(t) for t in texts]

    all_clauses = []     # flat list of clause strings to score
    clause_owner = []    # (review_idx, aspect) matching each entry in all_clauses

    for review_idx, clauses in enumerate(per_review_clauses):
        for clause in clauses:
            clause_lower = clause.lower()
            for aspect, keywords in ASPECT_KEYWORDS.items():
                if contains_any(clause_lower, keywords):
                    all_clauses.append(clause)
                    clause_owner.append((review_idx, aspect))

    clause_results = bert_sentiment(all_clauses) if all_clauses else []

    buckets = {}
    for (review_idx, aspect), (label, score) in zip(clause_owner, clause_results):
        buckets.setdefault((review_idx, aspect), []).append(label)

    results = []
    for review_idx in range(len(texts)):
        result = {aspect: "Not Mentioned" for aspect in ASPECT_LIST}
        for aspect in ASPECT_LIST:
            labels = buckets.get((review_idx, aspect))
            if labels:
                result[aspect] = Counter(labels).most_common(1)[0][0]

        mentioned = [a for a, v in result.items() if v != "Not Mentioned"]
        if not mentioned:
            overall = "Not Applicable"
        else:
            seen = [result[a] for a in mentioned]
            if "Negative" in seen and "Positive" in seen:
                overall = "Mixed"
            elif "Negative" in seen:
                overall = "Negative"
            elif "Positive" in seen:
                overall = "Positive"
            else:
                overall = "Neutral"
        result["Overall (aspect-weighted)"] = overall
        results.append(result)

    return results


# ----------------------------------------------------------------------
# 5. EMOTION DETECTION  (lexicon-based — unchanged by the DistilBERT swap)
# ----------------------------------------------------------------------

def detect_emotion(text, sentiment_label):
    text_lower = text.lower()
    counts = {emo: sum(text_lower.count(kw) for kw in kws)
              for emo, kws in EMOTION_KEYWORDS.items()}
    top_emotion, top_count = max(counts.items(), key=lambda x: x[1])
    if top_count == 0:
        if sentiment_label == "Positive":
            return "Happy"
        elif sentiment_label == "Negative":
            return "Disappointed"
        return "Neutral"
    return top_emotion


# ----------------------------------------------------------------------
# 6. COMPLAINT CATEGORIZATION  (lexicon-based — unchanged)
# ----------------------------------------------------------------------

def categorize_complaint(text, sentiment_label):
    if sentiment_label != "Negative":
        return "Not a Complaint"
    text_lower = text.lower()
    matches = {cat: sum(text_lower.count(kw) for kw in kws)
               for cat, kws in COMPLAINT_CATEGORY_KEYWORDS.items()}
    best_cat, best_score = max(matches.items(), key=lambda x: x[1])
    return best_cat if best_score > 0 else "General Dissatisfaction"


# ----------------------------------------------------------------------
# 7. INTENT RECOGNITION  (rule-based — unchanged)
# ----------------------------------------------------------------------

def _is_genuine_question(sentence):
    s = sentence.strip().lower()
    trailing_punct = re.search(r"[?!]+$", s)
    if not trailing_punct or "!" in trailing_punct.group() or "?" not in trailing_punct.group():
        return False
    return s.startswith(QUESTION_STARTERS)


def recognize_intent(text, sentiment_label):
    text_lower = text.lower().strip()

    for pat in SUGGESTION_PATTERNS:
        if re.search(pat, text_lower):
            return "Suggestion"

    try:
        sentences = sent_tokenize(text)
    except Exception:
        sentences = [text]
    if any(_is_genuine_question(s) for s in sentences):
        return "Inquiry"

    if sentiment_label == "Negative":
        return "Complaint"
    if sentiment_label == "Positive":
        return "Appreciation"
    return "Appreciation"


# ----------------------------------------------------------------------
# 8. KEYWORD / PHRASE EXTRACTION  (lightweight RAKE-style extraction)
# ----------------------------------------------------------------------

def extract_keyphrases(text, top_n=5):
    text_clean = re.sub(r"[^a-zA-Z\s]", " ", text.lower())
    words = text_clean.split()
    phrases, current = [], []
    for w in words:
        if w in STOPWORDS or len(w) <= 2:
            if current:
                phrases.append(" ".join(current))
                current = []
        else:
            current.append(w)
    if current:
        phrases.append(" ".join(current))

    freq = Counter(phrases)
    scored = sorted(freq.items(), key=lambda x: (len(x[0].split()), x[1]), reverse=True)
    return [p for p, _ in scored[:top_n] if p]


# ----------------------------------------------------------------------
# 9. AUTOMATIC TOPIC DISCOVERY  (corpus-level LDA — unchanged)
# ----------------------------------------------------------------------

def run_topic_model(texts, n_topics=8, n_top_words=8):
    vectorizer = CountVectorizer(max_df=0.90, min_df=10, stop_words="english",
                                  ngram_range=(1, 1))
    dtm = vectorizer.fit_transform(texts)
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=42,
                                     learning_method="online", max_iter=15)
    doc_topic = lda.fit_transform(dtm)

    feature_names = vectorizer.get_feature_names_out()
    topic_words = {}
    for idx, topic in enumerate(lda.components_):
        top_features = [feature_names[i] for i in topic.argsort()[:-n_top_words - 1:-1]]
        topic_words[idx] = top_features

    dominant_topic = doc_topic.argmax(axis=1)
    return dominant_topic, topic_words


def label_topic(words):
    """Light heuristic to turn top words into a human-readable label."""
    label_map = {
        "Food & Dining": {"food", "delicious", "menu", "dish", "restaurant", "meal",
                           "chicken", "pizza", "sauce", "flavor", "cheese", "burger",
                           "fries", "sandwich", "breakfast", "bread", "cream", "ice",
                           "chocolate", "cake", "flavors", "foods", "table", "ordered"},
        "Service & Staff": {"service", "staff", "friendly", "server", "manager",
                             "helpful", "customer"},
        "Wait Time / Ordering": {"time", "wait", "minutes", "order", "line", "long"},
        "Pricing & Value": {"price", "worth", "money", "cheap", "expensive", "value"},
        "Ambience / Location": {"place", "area", "location", "atmosphere", "nice",
                                 "clean", "parking", "bar", "beer", "night", "room",
                                 "hotel", "park", "beautiful"},
        "Shopping & Retail": {"store", "shop", "buy", "selection", "products", "item",
                               "market"},
        "Automotive / Professional Services": {"car", "job", "pay", "work", "told",
                                                 "visiting", "flat", "says"},
    }
    wset = set(words)
    best_label, best_overlap = "General Feedback", 0
    for label, kws in label_map.items():
        overlap = len(wset & kws)
        if overlap > best_overlap:
            best_overlap = overlap
            best_label = label
    return best_label


# ----------------------------------------------------------------------
# MAIN PIPELINE
# ----------------------------------------------------------------------

def run_pipeline(input_csv, output_csv, sample_size=None):
    df = pd.read_csv(input_csv)
    if sample_size:
        df = df.sample(n=sample_size, random_state=42).reset_index(drop=True)

    df["text"] = df["text"].astype(str)
    texts = df["text"].tolist()

    print(f"Processing {len(df)} reviews...")

    # 1. Language detection
    df["language"] = df["text"].apply(detect_language)

    # 2. Overall sentiment (DistilBERT, batched)
    print("Running overall sentiment (DistilBERT)...")
    sentiments = overall_sentiment_batch(texts)
    df["overall_sentiment"] = [s[0] for s in sentiments]
    df["sentiment_score"] = [s[1] for s in sentiments]

    # 3. Aspect-based sentiment (DistilBERT, batched across all clauses)
    print("Running aspect-based sentiment (DistilBERT)...")
    aspect_results = pd.Series(aspect_sentiment_batch(texts))
    for aspect in ASPECT_LIST:
        df[f"aspect_{aspect.replace(' ', '_')}"] = aspect_results.apply(lambda r: r[aspect])
    df["aspect_overall"] = aspect_results.apply(lambda r: r["Overall (aspect-weighted)"])

    # 4. Emotion detection
    df["emotion"] = [detect_emotion(t, s) for t, s in zip(df["text"], df["overall_sentiment"])]

    # 5. Complaint categorization
    df["complaint_category"] = [categorize_complaint(t, s) for t, s in
                                  zip(df["text"], df["overall_sentiment"])]

    # 6. Intent recognition
    df["intent"] = [recognize_intent(t, s) for t, s in
                     zip(df["text"], df["overall_sentiment"])]

    # 7. Keyword / phrase extraction
    df["top_keyphrases"] = df["text"].apply(lambda t: ", ".join(extract_keyphrases(t)))

    # 8. Automatic topic discovery
    print("Running topic discovery (LDA)...")
    dominant_topic, topic_words = run_topic_model(df["text"].tolist())
    df["topic_id"] = dominant_topic
    topic_labels = {tid: label_topic(words) for tid, words in topic_words.items()}
    df["topic_label"] = df["topic_id"].map(topic_labels)

    df.to_csv(output_csv, index=False)
    print(f"Saved enriched dataset -> {output_csv}")

    topic_summary = {int(tid): {"label": topic_labels[tid], "top_words": words}
                      for tid, words in topic_words.items()}
    with open(os.path.join(SCRIPT_DIR, "topic_summary.json"), "w") as f:
        json.dump(topic_summary, f, indent=2)
    print("Saved topic summary -> topic_summary.json")

    return df, topic_summary


if __name__ == "__main__":
    df, topics = run_pipeline(
        input_csv=os.path.join(SCRIPT_DIR, "yelp.csv"),
        output_csv=os.path.join(SCRIPT_DIR, "reviews_nlp_enriched.csv"),
    )
    print("\nSample of enriched output:")
    print(df[["stars", "overall_sentiment", "emotion", "intent",
               "aspect_overall", "topic_label"]].head(10).to_string())