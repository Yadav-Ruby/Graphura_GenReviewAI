import { Smile, Meh, Frown, Gauge } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SentimentPieChart, MonthlyTrendChart } from '@/components/charts/ChartWidgets'
import { sentimentDistribution, monthlyTrend, recentReviews } from '@/data/mockData'

const sentimentCards = [
  { label: 'Positive', value: sentimentDistribution[0].value, icon: Smile, color: 'text-success bg-success/10', pct: 70.2 },
  { label: 'Neutral', value: sentimentDistribution[1].value, icon: Meh, color: 'text-warning bg-warning/10', pct: 19.7 },
  { label: 'Negative', value: sentimentDistribution[2].value, icon: Frown, color: 'text-danger bg-danger/10', pct: 10.1 },
]

export default function SentimentAnalysis() {
  return (
    <DashboardLayout title="Sentiment Analysis">
      <div className="space-y-6 pt-2">
        <div className="grid gap-4 sm:grid-cols-3">
          {sentimentCards.map((c) => (
            <Card key={c.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-slate-500">{c.pct}%</span>
              </div>
              <p className="mt-4 font-mono text-2xl font-semibold text-white">{c.value.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">{c.label} reviews</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sentiment Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={monthlyTrend} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentPieChart data={sentimentDistribution} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10">
              <Gauge className="h-4 w-4 text-primary-400" />
            </div>
            <CardTitle>Per-Review Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReviews.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-2 rounded-xl border border-surface-border bg-surface-soft/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">{r.restaurant}</p>
                    <p className="truncate text-xs text-slate-500">{r.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={r.sentiment === 'positive' ? 'positive' : r.sentiment === 'negative' ? 'negative' : 'neutral'} className="capitalize">
                      {r.sentiment}
                    </Badge>
                    <span className="font-mono text-xs text-slate-500">
                      {(88 + (r.rating * 2)).toFixed(1)}% conf.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
