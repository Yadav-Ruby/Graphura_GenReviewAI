import { DashboardLayout } from '@/components/layout/DashboardLayout'
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
} from '@/data/mockData'

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6 pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reviews Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={monthlyTrend} />
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentPieChart data={sentimentDistribution} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingBarChart data={ratingDistribution} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
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
      </div>
    </DashboardLayout>
  )
}
