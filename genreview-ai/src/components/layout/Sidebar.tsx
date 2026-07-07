import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  UtensilsCrossed,
  MessageSquareText,
  UploadCloud,
  SprayCan,
  Smile,
  Layers3,
  Tags,
  FileText,
  Sparkles,
  BarChart3,
  FileBarChart2,
  ChevronsLeft,
  ChevronsRight,
  Brain,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Restaurants', path: '/restaurants', icon: UtensilsCrossed },
  { label: 'Reviews', path: '/review-analysis', icon: MessageSquareText },
  { label: 'Dataset Upload', path: '/dataset-upload', icon: UploadCloud },
  { label: 'Data Cleaning', path: '/data-cleaning', icon: SprayCan },
  { label: 'Sentiment Analysis', path: '/sentiment-analysis', icon: Smile },
  { label: 'Topic Modeling', path: '/topic-modeling', icon: Layers3 },
  { label: 'Keyword Extraction', path: '/keyword-extraction', icon: Tags },
  { label: 'Review Summarizer', path: '/review-summarizer', icon: FileText },
  { label: 'Review Generator', path: '/review-generator', icon: Sparkles },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/reports', icon: FileBarChart2 },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="relative hidden md:flex h-screen flex-col border-r border-surface-border bg-surface/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent shadow-glow">
          <Brain className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-display text-base font-bold tracking-tight text-white">
            GenReview <span className="text-primary-400">AI</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent/10 text-white border border-primary/30'
                  : 'text-slate-400 hover:bg-surface-soft hover:text-slate-100 border border-transparent',
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-soft py-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  )
}
