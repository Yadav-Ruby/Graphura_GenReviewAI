import {
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  UtensilsCrossed,
  Zap,
  Gauge,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { HeroSection } from '@/components/dashboard/HeroSection'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel'
import { TopRestaurants } from '@/components/dashboard/TopRestaurants'
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline'
import { ReviewsTable } from '@/components/dashboard/ReviewsTable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  MonthlyTrendChart,
  SentimentPieChart,
  RatingBarChart,
  PlatformDonutChart,
  CityBarChart,
} from '@/components/charts/ChartWidgets'
import {
  monthlyTrend,
  sentimentDistribution,
  ratingDistribution,
  platformDistribution,
  cityDistribution,
  recentReviews,
} from '@/data/mockData'

const spark = (base: number) => Array.from({ length: 8 }, (_, i) => base + Math.sin(i) * base * 0.08 + i * base * 0.01)

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 pt-2">
        <HeroSection />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Reviews" value={9740} change={12.4} icon={MessageSquareText} sparkline={spark(90)} accent="primary" delay={0.05} />
          <StatCard label="Positive Reviews" value={6840} change={8.2} icon={ThumbsUp} sparkline={spark(80)} accent="success" delay={0.1} />
          <StatCard label="Negative Reviews" value={980} change={-3.1} icon={ThumbsDown} sparkline={spark(20)} accent="danger" delay={0.15} />
          <StatCard label="Neutral Reviews" value={1920} change={1.6} icon={Minus} sparkline={spark(40)} accent="warning" delay={0.2} />
          <StatCard label="Average Rating" value={4.3} decimals={1} change={2.3} icon={Star} sparkline={spark(4.3)} accent="warning" delay={0.25} />
          <StatCard label="Restaurants Monitored" value={128} change={5.5} icon={UtensilsCrossed} sparkline={spark(110)} accent="primary" delay={0.3} />
          <StatCard label="Reviews Processed Today" value={342} change={14.8} icon={Zap} sparkline={spark(300)} accent="success" delay={0.35} />
          <StatCard label="AI Confidence Score" value={96.4} suffix="%" decimals={1} change={0.8} icon={Gauge} sparkline={spark(95)} accent="primary" delay={0.4} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Reviews Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={monthlyTrend} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentPieChart data={sentimentDistribution} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingBarChart data={ratingDistribution} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformDonutChart data={platformDistribution} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews by City</CardTitle>
            </CardHeader>
            <CardContent>
              <CityBarChart data={cityDistribution} />
            </CardContent>
          </Card>
        </div>

        <ReviewsTable data={recentReviews} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIInsightsPanel />
          </div>
          <TopRestaurants />
        </div>

        <div>
          <h2 className="mb-3 font-display text-sm font-semibold text-slate-300">Quick Actions</h2>
          <QuickActions />
        </div>

        <ActivityTimeline />
      </div>
    </DashboardLayout>
  )
}
