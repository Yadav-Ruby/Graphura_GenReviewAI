import { Brain, TrendingUp, Hash, AlertTriangle, Lightbulb, Gauge } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { topKeywords } from '@/data/mockData'

export function AIInsightsPanel() {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center gap-3 border-b border-surface-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent">
          <Brain className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-white">AI Insights</h3>
          <p className="text-xs text-slate-500">Generated from 9,740 reviews · updated 6 min ago</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="rounded-xl border border-surface-border bg-surface-soft/60 p-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Overall sentiment across monitored restaurants is <span className="text-success font-medium">strongly positive</span>,
            driven by consistent praise for service speed and ambience. Two locations show a declining trend in
            the past 14 days and may need operational attention.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div>
              <p className="text-xs font-medium text-slate-200">Key trend</p>
              <p className="text-xs text-slate-500">Positive mentions of "delivery time" up 18% this month</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-xs font-medium text-slate-200">Needs attention</p>
              <p className="text-xs text-slate-500">Coastal Kitchen, Nawabi Handi — hygiene complaints rising</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
            <div>
              <p className="text-xs font-medium text-slate-200">Recommendation</p>
              <p className="text-xs text-slate-500">Prioritize a QA review at flagged locations this week</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            <div>
              <p className="text-xs font-medium text-slate-200">Model confidence</p>
              <p className="text-xs text-slate-500">96.4% average confidence across classifications</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Hash className="h-3.5 w-3.5" />
            Popular keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map((k) => (
              <Badge key={k.word} variant="info" className="font-normal">
                {k.word}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
