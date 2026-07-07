import { Star, TrendingUp, TrendingDown, UtensilsCrossed } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { topRestaurants } from '@/data/mockData'

export function TopRestaurants() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Restaurants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topRestaurants.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-soft/50 p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/30 to-accent/20 text-primary-400">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{r.name}</p>
              <p className="text-xs text-slate-500">{r.city} · {r.reviewCount.toLocaleString()} reviews</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-semibold text-white">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {r.rating}
              </div>
              <div
                className={`flex items-center justify-end gap-1 text-xs font-medium ${
                  r.trend >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {r.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {r.positivePct}% positive
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
