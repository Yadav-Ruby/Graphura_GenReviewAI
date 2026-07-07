import { UploadCloud, BarChart2, FileBarChart2, Cpu, MessageSquarePlus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { recentActivity } from '@/data/mockData'
import type { ActivityItem } from '@/types'

const iconMap: Record<ActivityItem['type'], typeof UploadCloud> = {
  upload: UploadCloud,
  analysis: BarChart2,
  report: FileBarChart2,
  model: Cpu,
  reviews: MessageSquarePlus,
}

const colorMap: Record<ActivityItem['type'], string> = {
  upload: 'text-primary-400 bg-primary-500/10',
  analysis: 'text-success bg-success/10',
  report: 'text-accent-400 bg-accent/10',
  model: 'text-warning bg-warning/10',
  reviews: 'text-slate-300 bg-surface-soft',
}

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l border-surface-border pl-6">
          {recentActivity.map((item) => {
            const Icon = iconMap[item.type]
            return (
              <li key={item.id} className="relative">
                <span
                  className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface ${colorMap[item.type]}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500">{item.timestamp}</p>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
