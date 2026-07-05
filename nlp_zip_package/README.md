# GenReview AI — NLP Engine

Implements PRD Section 10.3.1 (Natural Language Processing Engine): overall
sentiment, aspect-based sentiment, emotion detection, keyword/phrase
extraction, complaint categorization, intent recognition, automatic topic
discovery, and language detection — built and validated on the 10,000-review
Yelp dataset.

## Files in this folder

| File | What it is |
|---|---|
| `nlp_engine.py` | The pipeline as a plain Python script (run from terminal or VS Code) |
| `NLP_Engine_Notebook.ipynb` | The same pipeline as a Jupyter notebook, with markdown explanations and inline charts |
| `nlp_engine_notebook.py` | Source for the notebook (jupytext "percent" format — editable as plain text, regenerate the `.ipynb` from it if you prefer) |
| `yelp.csv` | Input dataset — put your copy here (see below) |
| `reviews_nlp_enriched.csv` | Output: original data + 17 new NLP columns |
| `topic_summary.json` | Output: discovered topics and their top keywords |
| `charts/` | Output: PNG charts (sentiment, aspects, emotions, intent, complaints, topics) |
| `GenReviewAI_NLP_Engine_Report.docx` | Full write-up: methodology, validation metrics, worked example, limitations |
| `requirements.txt` | Python package list |

---

## Option A — Run in VS Code (plain Python script)

1. **Install VS Code** (if you don't have it): https://code.visualstudio.com
2. **Install the Python extension** — open VS Code → Extensions (`Ctrl+Shift+X` /
   `Cmd+Shift+X`) → search "Python" (by Microsoft) → Install.
3. **Open this folder in VS Code**: `File → Open Folder…` → select this project folder.
4. **Create a virtual environment** (recommended) — open a terminal in VS Code
   (`` Ctrl+` ``) and run:
   ```bash
   python3 -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
5. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
6. **Place `yelp.csv`** in this same folder (or edit the `input_csv` path in
   `nlp_engine.py`'s last few lines to point wherever it is).
7. **Run it**:
   ```bash
   python3 nlp_engine.py
   ```
   Or click the ▶ "Run" button in the top-right of VS Code with
   `nlp_engine.py` open — VS Code will use the Python interpreter from your
   venv (pick it via `Ctrl+Shift+P` → "Python: Select Interpreter" if it
   doesn't auto-detect).
8. Output files (`reviews_nlp_enriched.csv`, `topic_summary.json`) appear in
   the same folder.

---

## Option B — Run as a Jupyter Notebook

### In VS Code
1. Do steps 1–5 above (Python extension + venv + `pip install -r requirements.txt`).
2. Also install the **Jupyter extension** in VS Code (Extensions → search
   "Jupyter" by Microsoft → Install).
3. Open `NLP_Engine_Notebook.ipynb` directly in VS Code — it opens as a
   notebook automatically.
4. Pick the kernel: top-right of the notebook → "Select Kernel" → choose your
   `venv` Python interpreter.
5. Run cells top to bottom (`Shift+Enter` on each, or "Run All" from the
   toolbar).

### In classic Jupyter / JupyterLab
1. Install Jupyter if you don't have it:
   ```bash
   pip install jupyter
   ```
2. From this folder, launch it:
   ```bash
   jupyter notebook
   # or: jupyter lab
   ```
3. In the browser tab that opens, click `NLP_Engine_Notebook.ipynb`.
4. Run cells top to bottom (`Shift+Enter`).

### Notes for the notebook
- Cell "11. Run the full pipeline" has an `INPUT_CSV = "yelp.csv"` line —
  point this at your file if it's not in the same folder.
- There's also a `SAMPLE_SIZE = None` line — set it to a small number (e.g.
  `300`) the first time you run it, just to confirm everything works before
  processing the full 10,000 rows (which takes a few minutes on a laptop,
  mostly in the topic-modeling and per-sentence sentiment steps).
- Charts render inline in the notebook automatically (`plt.show()`); no
  separate PNG files needed unless you want them.

---

## Regenerating the Word report

The `.docx` report was built with a small Node.js script (`build_report.js`,
not included by default to keep this zip lean — ask if you'd like it) using
the `docx` npm package. The report itself is a static deliverable; you don't
need Node.js just to read it.

---

## Known limitations (also covered in the report)

- Lexicon-based sentiment slightly undershoots on negative reviews (~41%
  recall) since polite negativity is hard for keyword-based models to catch.
- Emotion detection scores the whole review's keywords rather than isolating
  the dominant clause, so a review that's mostly negative but contains one
  strongly positive word can be mislabeled.
- Aspect/complaint keyword lists are tuned for food & hospitality reviews;
  other business verticals (tyre shops, salons, etc.) would need their own
  keyword sets added to `ASPECT_KEYWORDS` / `COMPLAINT_CATEGORY_KEYWORDS`.
