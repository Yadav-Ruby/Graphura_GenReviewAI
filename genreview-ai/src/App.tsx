import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UtensilsCrossed, UploadCloud, SprayCan, Layers3, Tags, FileText, Sparkles, FileBarChart2 } from 'lucide-react'
import { ThemeProvider } from '@/context/ThemeContext'
import Dashboard from '@/pages/Dashboard'
import ReviewAnalysis from '@/pages/ReviewAnalysis'
import SentimentAnalysis from '@/pages/SentimentAnalysis'
import Analytics from '@/pages/Analytics'
import Login from '@/pages/Login'
import PlaceholderPage from '@/pages/PlaceholderPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/review-analysis" element={<ReviewAnalysis />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="/restaurants"
            element={<PlaceholderPage title="Restaurants" description="Manage and monitor all onboarded restaurant locations in one place." icon={UtensilsCrossed} />}
          />
          <Route
            path="/dataset-upload"
            element={<PlaceholderPage title="Dataset Upload" description="Upload CSV, JSON, or connect a live feed to ingest new review data." icon={UploadCloud} />}
          />
          <Route
            path="/data-cleaning"
            element={<PlaceholderPage title="Data Cleaning" description="Automatically detect duplicates, spam, and malformed review records." icon={SprayCan} />}
          />
          <Route
            path="/topic-modeling"
            element={<PlaceholderPage title="Topic Modeling" description="Discover latent themes across thousands of reviews using AI clustering." icon={Layers3} />}
          />
          <Route
            path="/keyword-extraction"
            element={<PlaceholderPage title="Keyword Extraction" description="Surface the most frequently mentioned terms and phrases automatically." icon={Tags} />}
          />
          <Route
            path="/review-summarizer"
            element={<PlaceholderPage title="Review Summarizer" description="Generate concise AI summaries from hundreds of reviews in seconds." icon={FileText} />}
          />
          <Route
            path="/review-generator"
            element={<PlaceholderPage title="Review Generator" description="Create realistic sample reviews for testing and QA workflows." icon={Sparkles} />}
          />
          <Route
            path="/reports"
            element={<PlaceholderPage title="Reports" description="Export polished, shareable intelligence reports as PDF or CSV." icon={FileBarChart2} />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
