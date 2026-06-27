# 🌍 CrisisWatch

**An autonomous AI agent for real-time global epidemic intelligence.**

CrisisWatch continuously monitors WHO, CDC, ECDC, and ReliefWeb for active disease outbreaks, uses Gemini to read and reason about raw web content like an epidemiologist, and surfaces the results on a live interactive dashboard — with zero manual curation.

https://crisiswatch-frontend-qprh.onrender.com/
---

## 🧠 What makes this an *agent*, not just a scraper

Most "outbreak trackers" rely on RSS feeds and keyword matching. CrisisWatch instead:

1. **Scrapes raw web pages** directly from WHO, CDC, ECDC, and ReliefWeb — no RSS dependency
2. **Reasons step-by-step** using Gemini 3.1, following a structured analyst workflow: scan → filter → deduplicate → extract numbers → classify → summarize
3. **Distinguishes human vs. animal case counts** — a common failure point for naive extractors (e.g. H5N1 in cattle vs. confirmed human infections)
4. **Deduplicates outbreaks across countries** — one global H5N1 situation isn't split into five separate incidents
5. **Calibrates confidence and severity** relative to population, source reputation, and lifecycle stage
6. **Persists reasoning** to MongoDB as long-term agent memory, enabling deduplication across runs
7. **Runs autonomously** on a 30-minute schedule, with retry logic for transient failures (503s, cold-start backends)

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  WHO / CDC /     │────▶│   Pipeline   │────▶│  Gemini 3.1      │
│  ECDC / ReliefWeb│     │  (scraper)   │     │  (reasoning)     │
└─────────────────┘     └──────────────┘     └────────┬─────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Svelte +        │◀────│  FastAPI     │◀────│   MongoDB        │
│  Leaflet UI      │     │  (Render)    │     │  (agent memory)  │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

| Layer | Tech |
|---|---|
| Scraping | `httpx`, `Playwright` (fallback for JS-rendered pages) |
| Reasoning | Gemini 3.1 Flash Lite |
| Backend | FastAPI, hosted on Render |
| Database | MongoDB Atlas |
| Frontend | Svelte + Leaflet, dark UI |
| Scheduling | APScheduler (30-min interval) |

---

## ✨ Features

- 🗺️ **Live world map** — severity-coded markers (critical/high/moderate/low), sized by case count
- 📊 **AI Situation Summary** — per-outbreak briefing written by Gemini, with confidence scores
- 🌧️ **Climate trigger detection** — cross-references Open-Meteo precipitation data to flag monsoon-driven outbreak risk (e.g. cholera after flooding)
- 🧬 **Disease normalization** — "Bundibugyo virus" → "Ebola (Bundibugyo)", "Mpox/Monkeypox Clade I/II" → "Mpox"
- 📈 **Population-relative severity** — 500 cases in Haiti (11M people) is weighted differently than 500 cases in India (1.4B people)
- 🔄 **Source reconciliation** — same outbreak reported by WHO and ReliefWeb is merged into one incident with combined source URLs

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### Backend Setup

```bash
git clone https://github.com/square-box-hash/crisiswatch.git
cd crisiswatch

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
playwright install chromium
```

Create a `.env` file:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
CRISISWATCH_API=https://your-backend.onrender.com
```

Run the pipeline once:

```bash
python pipeline.py --once
```

Or run on a schedule (every 30 minutes):

```bash
python pipeline.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Update `src/lib/constants.js` with your backend URL:

```javascript
export const API_BASE_URL = 'https://your-backend.onrender.com'
```

---

## 📁 Project Structure

```
CRISISWATCH-FRONTEND
├── node_modules/
├── public/
└── src/
    ├── assets/
    │   ├── hero.png
    │   ├── svelte.svg
    │   └── vite.svg
    ├── lib/
    │   ├── components/
    │   │   ├── details/
    │   │   │   └── DetailsPanel.svelte
    │   │   ├── layout/
    │   │   │   ├── Header.svelte
    │   │   │   └── Sidebar.svelte
    │   │   ├── map/
    │   │   │   └── MapView.svelte
    │   │   ├── outbreaks/
    │   │   │   └── OutbreakFeed.svelte
    │   │   └── ui/
    │   ├── services/
    │   │   └── api.js
    │   ├── stores/
    │   │   └── Index.js
    │   └── styles/
    │       └── theme.js
    ├── constants.js
    ├── app.css
    ├── App.svelte
    └── main.js
├── .gitignore
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── svelte.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🧪 How the AI Reasoning Works

Each scraped page is sent to Gemini with a structured prompt that walks through:

1. **Scan** — list every disease, location, number mentioned
2. **Filter** — remove historical/preparedness/animal-only content
3. **Deduplicate** — merge same-disease entries across countries
4. **Extract** — pull exact case/death counts (with rules for vague language like "dozens")
5. **Classify** — assign lifecycle stage, spread risk, confidence
6. **Summarize** — write a minister-ready briefing

The prompt includes worked examples for edge cases discovered during development — e.g. correctly extracting 71 human H5N1 cases from a page that also mentions 1,000 affected cattle herds.

---

## 🗺️ Roadmap

- [ ] Expand `COUNTRY_COORDS` with more granular regional coordinates
- [ ] Add spread projection using historical trend data
- [ ] Worker/doctor message submission portal
- [ ] Multi-language source support (non-English WHO regional offices)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built for the Google Cloud Rapid Agent Hackathon, using Gemini 3.1 and MongoDB Atlas.

Data sources: World Health Organization (WHO), Centers for Disease Control (CDC), European Centre for Disease Prevention and Control (ECDC), ReliefWeb (UN OCHA), Open-Meteo.
