"""
GenReview AI — NLP Engine (Section 10.3.1 of the Graphura PRD)

Converts unstructured customer review text into structured business
intelligence:

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
Output: reviews_nlp_enriched.csv + charts/ + topic_model summary

Run:  python3 nlp_engine.py
"""

import re
import json
import warnings
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.metrics import accuracy_score, classification_report
from langdetect import detect, DetectorFactory, LangDetectException
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

warnings.filterwarnings("ignore")
DetectorFactory.seed = 42  # deterministic langdetect

for pkg in ["punkt", "punkt_tab", "stopwords"]:
    try:
        nltk.data.find(f"tokenizers/{pkg}" if "punkt" in pkg else f"corpora/{pkg}")
    except LookupError:
        nltk.download(pkg, quiet=True)

STOPWORDS = set(stopwords.words("english"))
sia = SentimentIntensityAnalyzer()

# Domain-tuning: VADER's general-purpose lexicon doesn't carry strong
# valence for words that are specifically negative in a service/hospitality
# review context (e.g. "waited 30 minutes" reads neutral to VADER by
# default). These adjustments are additive on top of the base lexicon.

sia.lexicon.update({
    "wait": -0.6, "waited": -0.9, "waiting": -0.7, "queue": -0.4,
    "slow": -0.8, "delay": -0.9, "delayed": -0.9, "forever": -0.7,
    "overpriced": -1.2, "rude": -1.8, "dirty": -1.2, "filthy": -2.0,
    "unhygienic": -1.8, "understaffed": -0.9, "ignored": -1.2,
})


# 1. LEXICONS  (rule-based layer — fast, transparent, no external API
#    calls needed; this is the "small/fast tier" approach the PRD
#    recommends in Section 8 applied to analysis rather than drafting)


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
    "Ambience": ["ambience", "ambiance", "atmosphere", "decor", "d\u00e9cor", "music",
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
# A genuine inquiry is a sentence that both starts with an interrogative /
# auxiliary word AND ends in a real question mark (not a "?!" exclamation).
QUESTION_STARTERS = ("does", "is", "are", "can", "could", "would", "will",
                      "how", "what", "why", "when", "where", "who", "should",
                      "wondering", "anyone know")

ASPECT_LIST = list(ASPECT_KEYWORDS.keys())


def contains_any(text_lower, keywords):
    return any(kw in text_lower for kw in keywords)


# 2. LANGUAGE DETECTION


def detect_language(text):
    try:
        sample = text[:500].strip()
        if len(sample) < 3:
            return "unknown"
        return detect(sample)
    except LangDetectException:
        return "unknown"



# 3. OVERALL SENTIMENT

def overall_sentiment(text):
    score = sia.polarity_scores(text)["compound"]
    if score >= 0.05:
        label = "Positive"
    elif score <= -0.05:
        label = "Negative"
    else:
        label = "Neutral"
    return label, score



# 4. ASPECT-BASED SENTIMENT


CONTRAST_SPLIT = re.compile(
    r"\b(but|however|although|though|whereas|yet|except that|on the other hand)\b",
    flags=re.IGNORECASE)


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
        # re.split with a capturing group interleaves the delimiter; keep only text chunks
        clauses.extend([p.strip() for p in parts if p and not CONTRAST_SPLIT.fullmatch(p.strip())])
    return [c for c in clauses if c]


def aspect_sentiment(text):
    text_lower = text.lower()
    sentences = split_into_clauses(text)

    result = {aspect: "Not Mentioned" for aspect in ASPECT_LIST}
    scores = {aspect: [] for aspect in ASPECT_LIST}

    for sent in sentences:
        sent_lower = sent.lower()
        sent_score = sia.polarity_scores(sent)["compound"]
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if contains_any(sent_lower, keywords):
                scores[aspect].append(sent_score)

    for aspect, vals in scores.items():
        if vals:
            avg = np.mean(vals)
            if avg >= 0.05:
                result[aspect] = "Positive"
            elif avg <= -0.05:
                result[aspect] = "Negative"
            else:
                result[aspect] = "Neutral"

    mentioned = [a for a, v in result.items() if v != "Not Mentioned"]
    if not mentioned:
        overall = "Not Applicable"
    else:
        labels = [result[a] for a in mentioned]
        if "Negative" in labels and "Positive" in labels:
            overall = "Mixed"
        elif "Negative" in labels:
            overall = "Negative"
        elif "Positive" in labels:
            overall = "Positive"
        else:
            overall = "Neutral"

    result["Overall (aspect-weighted)"] = overall
    return result


# 5. EMOTION DETECTION

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


# 6. COMPLAINT CATEGORIZATION


def categorize_complaint(text, sentiment_label):
    if sentiment_label != "Negative":
        return "Not a Complaint"
    text_lower = text.lower()
    matches = {cat: sum(text_lower.count(kw) for kw in kws)
               for cat, kws in COMPLAINT_CATEGORY_KEYWORDS.items()}
    best_cat, best_score = max(matches.items(), key=lambda x: x[1])
    return best_cat if best_score > 0 else "General Dissatisfaction"



# 7. INTENT RECOGNITION


def _is_genuine_question(sentence):
    s = sentence.strip().lower()
    trailing_punct = re.search(r"[?!]+$", s)
    # Mixed "?!"/"!?"/"?!?!" runs are exclamatory, not genuine questions
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


# 8. KEYWORD / PHRASE EXTRACTION  (lightweight RAKE-style extraction)


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


# 9. AUTOMATIC TOPIC DISCOVERY  (corpus-level LDA)


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
    """Very light heuristic to turn top words into a human-readable label."""
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



# MAIN PIPELINE


def run_pipeline(input_csv, output_csv, sample_size=None):
    df = pd.read_csv(input_csv)
    if sample_size:
        df = df.sample(n=sample_size, random_state=42).reset_index(drop=True)

    df["text"] = df["text"].astype(str)

    print(f"Processing {len(df)} reviews...")

    # 1. Language detection
    df["language"] = df["text"].apply(detect_language)

    # 2. Overall sentiment
    sentiments = df["text"].apply(overall_sentiment)
    df["overall_sentiment"] = sentiments.apply(lambda x: x[0])
    df["sentiment_score"] = sentiments.apply(lambda x: x[1])

    # 3. Aspect-based sentiment
    aspect_results = df["text"].apply(aspect_sentiment)
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
    dominant_topic, topic_words = run_topic_model(df["text"].tolist())
    df["topic_id"] = dominant_topic
    topic_labels = {tid: label_topic(words) for tid, words in topic_words.items()}
    df["topic_label"] = df["topic_id"].map(topic_labels)

    df.to_csv(output_csv, index=False)
    print(f"Saved enriched dataset -> {output_csv}")

    topic_summary = {int(tid): {"label": topic_labels[tid], "top_words": words}
                      for tid, words in topic_words.items()}
    with open("topic_summary.json", "w") as f:
        json.dump(topic_summary, f, indent=2)
    print("Saved topic summary -> topic_summary.json")

    return df, topic_summary


CHART_COLORS = {
    "Positive": "#4C9A6A", "Negative": "#C1443C", "Neutral": "#B8A94A",
    "Mixed": "#D48A3B", "Not Applicable": "#9CA3AF",
}


def star_to_label(stars):
    if stars <= 2:
        return "Negative"
    if stars == 3:
        return "Neutral"
    return "Positive"


def save_charts(df, charts_dir):
    charts_dir = Path(charts_dir)
    charts_dir.mkdir(parents=True, exist_ok=True)

    vc = df["overall_sentiment"].value_counts()
    plt.figure(figsize=(6, 5))
    plt.pie(vc.values, labels=vc.index, autopct="%1.1f%%",
            colors=[CHART_COLORS.get(k, "#888") for k in vc.index], startangle=90)
    plt.title("Overall Sentiment Distribution")
    plt.tight_layout()
    plt.savefig(charts_dir / "01_sentiment_distribution.png", dpi=150)
    plt.close()

    ct = pd.crosstab(df["stars"], df["overall_sentiment"], normalize="index") * 100
    ct[["Negative", "Neutral", "Positive"]].plot(
        kind="bar", stacked=True, figsize=(7, 5),
        color=[CHART_COLORS["Negative"], CHART_COLORS["Neutral"], CHART_COLORS["Positive"]])
    plt.title("NLP Sentiment vs. Star Rating")
    plt.xlabel("Star Rating")
    plt.ylabel("% of reviews")
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.savefig(charts_dir / "02_sentiment_vs_stars.png", dpi=150)
    plt.close()

    aspects = ["Food", "Service", "Staff", "Pricing", "Cleanliness", "Ambience", "Wait Time"]
    rows = []
    for aspect in aspects:
        col = f"aspect_{aspect.replace(' ', '_')}"
        vc = df[col].value_counts()
        rows.append({"aspect": aspect, "Positive": vc.get("Positive", 0),
                     "Negative": vc.get("Negative", 0), "Neutral": vc.get("Neutral", 0)})
    aspect_df = pd.DataFrame(rows).set_index("aspect")
    aspect_df[["Positive", "Neutral", "Negative"]].plot(
        kind="barh", stacked=True, figsize=(8, 5),
        color=[CHART_COLORS["Positive"], CHART_COLORS["Neutral"], CHART_COLORS["Negative"]])
    plt.title("Aspect-Based Sentiment")
    plt.xlabel("Number of reviews mentioning this aspect")
    plt.tight_layout()
    plt.savefig(charts_dir / "03_aspect_sentiment.png", dpi=150)
    plt.close()

    df["emotion"].value_counts().plot(kind="bar", figsize=(6, 5), color="#5B7FBF")
    plt.title("Emotion Detection Distribution")
    plt.ylabel("Number of reviews")
    plt.xticks(rotation=20)
    plt.tight_layout()
    plt.savefig(charts_dir / "04_emotion_distribution.png", dpi=150)
    plt.close()

    df["intent"].value_counts().plot(kind="bar", figsize=(6, 5), color="#8A63D2")
    plt.title("Customer Intent Recognition")
    plt.ylabel("Number of reviews")
    plt.tight_layout()
    plt.savefig(charts_dir / "05_intent_distribution.png", dpi=150)
    plt.close()

    cc = df[df["complaint_category"] != "Not a Complaint"]["complaint_category"].value_counts()
    cc[::-1].plot(kind="barh", figsize=(7, 5), color="#C1443C")
    plt.title("Complaint Categorization (negative reviews only)")
    plt.xlabel("Number of reviews")
    plt.tight_layout()
    plt.savefig(charts_dir / "06_complaint_categories.png", dpi=150)
    plt.close()

    df["topic_label"].value_counts().plot(kind="bar", figsize=(7, 5), color="#3F9C8F")
    plt.title("Automatic Topic Discovery — Dominant Topic per Review")
    plt.ylabel("Number of reviews")
    plt.xticks(rotation=20, ha="right")
    plt.tight_layout()
    plt.savefig(charts_dir / "07_topic_distribution.png", dpi=150)
    plt.close()

    print(f"Saved charts -> {charts_dir}/")


def print_validation(df):
    df = df.copy()
    df["expected"] = df["stars"].apply(star_to_label)
    acc = accuracy_score(df["expected"], df["overall_sentiment"])
    print(f"\nAccuracy vs star-derived label: {acc:.4f}")
    print(classification_report(df["expected"], df["overall_sentiment"]))


def print_worked_example():
    example = ("The food was excellent, but we waited almost 30 minutes "
               "before anyone served us.")
    label, score = overall_sentiment(example)
    print("\n--- Worked example ---")
    print(f"Text: {example}")
    print(f"Overall sentiment: {label} ({score:.3f})")
    print(f"Aspects: {aspect_sentiment(example)}")
    print(f"Emotion: {detect_emotion(example, label)}")
    print(f"Intent: {recognize_intent(example, label)}")
    print(f"Keyphrases: {extract_keyphrases(example)}")


if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    input_csv = base_dir / "yelp.csv"
    output_csv = base_dir / "reviews_nlp_enriched.csv"
    charts_dir = base_dir / "charts"

    df, topics = run_pipeline(
        input_csv=str(input_csv),
        output_csv=str(output_csv),
    )

    print("\nSample of enriched output:")
    print(df[["stars", "overall_sentiment", "emotion", "intent",
              "aspect_overall", "topic_label"]].head(10).to_string())

    print_validation(df)
    save_charts(df, charts_dir)
    print_worked_example()
