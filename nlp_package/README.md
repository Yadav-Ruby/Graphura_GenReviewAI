# 🍽️ GenReview AI

> AI-powered Restaurant Review Intelligence Platform that transforms raw customer reviews into actionable business insights using Natural Language Processing (NLP) and an interactive analytics dashboard.

# Overview

GenReview AI is an end-to-end Restaurant Review Intelligence platform designed to analyze thousands of customer reviews and generate meaningful business insights.

The system combines a powerful NLP engine with a modern React dashboard to help restaurants understand customer sentiment, identify recurring issues, discover trending topics, and monitor customer satisfaction.

---

#  Key Features

## NLP Engine

- Overall Sentiment Analysis
- Aspect-Based Sentiment Analysis
- Emotion Detection
- Intent Recognition
- Complaint Categorization
- Keyword & Keyphrase Extraction
- Automatic Topic Discovery
- Language Detection
- Review Enrichment Pipeline

---

##  Analytics Dashboard

- Interactive Dashboard
- Restaurant Performance Overview
- Review Analytics
- Sentiment Distribution
- Complaint Monitoring
- Topic Visualization
- AI Generated Insights
- Responsive UI
- Dark / Light Theme

---

#  Project Architecture

```
GenReviewAI/
│
├── genreview-ai/              # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── nlp_package/               # NLP Engine
│   ├── nlp_engine.py
│   ├── requirements.txt
│   ├── reviews_nlp_enriched.csv
│   └── topic_summary.json
│
└── README.md
```

---

#  Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Chart Components

## Backend / NLP

- Python
- Pandas
- NumPy
- NLTK
- TextBlob
- Scikit-learn
- Gensim
- Matplotlib

---

#  Dataset

The NLP pipeline has been developed and tested on approximately **10,000 Yelp restaurant reviews**.

Each review contains:

- Restaurant Name
- Rating
- Review Text
- Review Date
- Platform
- Location

---

#  NLP Capabilities

The pipeline performs the following tasks:

- Overall Sentiment Analysis
- Aspect-Level Sentiment
- Emotion Detection
- Keyword Extraction
- Complaint Detection
- Intent Classification
- Topic Modeling
- Language Detection

The processed dataset contains enriched NLP features that can be directly visualized in the dashboard.

---

#  Dashboard Modules

- Dashboard Overview
- Sentiment Analytics
- Review Explorer
- Restaurant Rankings
- Topic Analysis
- AI Insights
- Activity Timeline
- Quick Actions

---


# ▶️ Frontend Setup

```bash
cd genreview-ai

npm install

npm run dev
```

The application will start on:

```
http://localhost:5173
```

---

# ▶️ NLP Setup

Navigate to:

```bash
cd nlp_package
```

Create virtual environment

```bash
python -m venv venv
```

Activate

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
python nlp_engine.py
```

---

# Output Files

The pipeline generates:

| File | Description |
|------|-------------|
| reviews_nlp_enriched.csv | Review dataset with NLP features |
| topic_summary.json | Extracted topics |
| Charts | Sentiment, Emotion, Topic & Complaint Visualizations |

---

#  Sample NLP Outputs

- Positive / Neutral / Negative Sentiment
- Aspect Scores
- Emotion Labels
- Complaint Categories
- User Intent
- Topic Clusters
- Keywords
- Language Labels

---

#  Project Preview

You can add screenshots here.

```
screenshots/
    dashboard.png
    analytics.png
    sentiment.png
```

---

#  Future Improvements

- LLM-based Review Summarization
- Recommendation Engine
- Real-time Review Streaming
- Multi-language Translation
- Restaurant Comparison
- Admin Panel
- User Authentication
- Cloud Deployment
- API Integration

---
