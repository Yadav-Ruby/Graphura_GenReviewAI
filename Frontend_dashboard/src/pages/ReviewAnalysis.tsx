import { MessageSquareText, Flag, Clock, CheckCircle2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ReviewsTable } from '@/components/dashboard/ReviewsTable'
import { Card } from '@/components/ui/Card'
import { recentReviews } from '@/data/mockData'

const summary = [
  { label: 'Total Reviews', value: recentReviews.length * 137, icon: MessageSquareText, color: 'text-primary-400 bg-primary-500/10' },
  { label: 'Processed', value: recentReviews.filter((r) => r.status === 'processed').length * 137, icon: CheckCircle2, color: 'text-success bg-success/10' },
  { label: 'Pending Review', value: recentReviews.filter((r) => r.status === 'pending').length * 41, icon: Clock, color: 'text-warning bg-warning/10' },
  { label: 'Flagged', value: recentReviews.filter((r) => r.status === 'flagged').length * 23, icon: Flag, color: 'text-danger bg-danger/10' },
]

export default function ReviewAnalysis() {
  return (
    <DashboardLayout title="Review Analysis">
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summary.map((s) => (
            <Card key={s.label} className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-lg font-semibold text-white">{s.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <ReviewsTable data={recentReviews} title="All Reviews" />
      </div>
    </DashboardLayout>
  )
}
