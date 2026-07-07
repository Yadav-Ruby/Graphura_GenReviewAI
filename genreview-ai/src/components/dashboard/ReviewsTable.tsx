import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Review, Sentiment, ReviewStatus } from '@/types'

const sentimentVariant: Record<Sentiment, 'positive' | 'neutral' | 'negative'> = {
  positive: 'positive',
  neutral: 'neutral',
  negative: 'negative',
}

const statusVariant: Record<ReviewStatus, 'positive' | 'warning' | 'negative'> = {
  processed: 'positive',
  pending: 'warning',
  flagged: 'negative',
}

const PAGE_SIZE = 5

export function ReviewsTable({ data, title = 'Recent Reviews' }: { data: Review[]; title?: string }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | Sentiment>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchesQuery =
        r.restaurant.toLowerCase().includes(query.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || r.sentiment === filter
      return matchesQuery && matchesFilter
    })
  }, [data, query, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Card>
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <CardTitle>{title}</CardTitle>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-soft px-3 py-2 sm:w-64">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search reviews..."
              className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | Sentiment)
              setPage(1)
            }}
            className="rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-medium">Restaurant</th>
                <th className="py-3 pr-4 font-medium">Platform</th>
                <th className="py-3 pr-4 font-medium">Rating</th>
                <th className="py-3 pr-4 font-medium">Sentiment</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-surface-border/60 transition-colors hover:bg-surface-soft/50"
                >
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-100">{r.restaurant}</p>
                    <p className="max-w-xs truncate text-xs text-slate-500">{r.excerpt}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{r.platform}</td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1 text-slate-200">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {r.rating}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={sentimentVariant[r.sentiment]} className="capitalize">
                      {r.sentiment}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{r.date}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[r.status]} className="capitalize">
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    No reviews match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {pageData.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="tabular">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
