import { Search, Bell, Sun, Moon, Circle, Menu } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export function Navbar({ title, onMenuClick }: { title: string; onMenuClick?: () => void }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-surface-border bg-canvas/70 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface-soft text-slate-300 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-white md:text-xl">{title}</h1>
          <p className="hidden text-xs text-slate-500 md:block">{today}</p>
        </div>
      </div>

      <div className="hidden flex-1 max-w-md items-center gap-2 rounded-xl border border-surface-border bg-surface-soft px-3 py-2 lg:flex">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search restaurants, reviews, reports..."
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success sm:flex">
          <Circle className="h-2 w-2 fill-success text-success animate-pulse" />
          AI Online
        </span>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-surface-soft text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-surface-soft text-slate-300 hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-xs font-semibold text-white">
          AK
        </div>
      </div>
    </header>
  )
}
