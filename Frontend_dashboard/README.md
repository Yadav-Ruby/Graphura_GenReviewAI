# GenReview AI — Restaurant Review Intelligence Dashboard

A premium, dark-mode-first SaaS dashboard UI for an AI-powered restaurant review intelligence platform. Built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts.

## Pages

- **Login** (`/login`) — standalone auth screen, demo-only (any credentials sign you in)
- **Dashboard** (`/`) — hero section, 8 animated stat cards, 5 chart types, recent reviews table, AI insights panel, top restaurants, quick actions, activity timeline
- **Review Analysis** (`/review-analysis`) — searchable/filterable review table with status summary
- **Sentiment Analysis** (`/sentiment-analysis`) — sentiment breakdown, trend chart, per-review classification with confidence scores
- **Analytics** (`/analytics`) — full chart suite (line, pie, bar, donut, horizontal bar)
- Remaining sidebar items (Restaurants, Dataset Upload, Data Cleaning, Topic Modeling, Keyword Extraction, Review Summarizer, Review Generator, Reports) render lightweight placeholder screens so navigation and routing are fully wired end-to-end.

## Getting started

```bash
npm install
npm run dev      # start local dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (custom dark theme, tokens in `tailwind.config.js`)
- Framer Motion for entrance/hover/ambient animations
- Recharts for all chart types
- Lucide React for icons
- React Router v6 for client-side routing

## Structure

```
src/
  components/
    layout/       Sidebar, Navbar, MobileNav, DashboardLayout
    ui/           Card, Badge, Button (reusable primitives)
    dashboard/    StatCard, HeroSection, AIInsightsPanel, QuickActions,
                  ActivityTimeline, TopRestaurants, ReviewsTable
    charts/       All Recharts wrappers (ChartWidgets.tsx)
  context/        ThemeContext (dark/light toggle)
  data/           mockData.ts — realistic dummy data
  pages/          Dashboard, ReviewAnalysis, SentimentAnalysis, Analytics, Login, PlaceholderPage
  types/          Shared TypeScript interfaces
```

## Notes

- Dark mode is the default; the sun/moon icon in the navbar toggles theme.
- All data is mocked in `src/data/mockData.ts` — no backend calls are made anywhere in the app.
- Fully responsive: collapsible desktop sidebar, slide-in drawer nav on mobile, responsive grids down to small screens.
