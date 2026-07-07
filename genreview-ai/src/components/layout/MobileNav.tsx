import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Brain, LayoutDashboard, UtensilsCrossed, MessageSquareText, UploadCloud, SprayCan, Smile, Layers3, Tags, FileText, Sparkles, BarChart3, FileBarChart2 } from 'lucide-react'
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

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-surface-border bg-surface md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-base font-bold text-white">
                  GenReview <span className="text-primary-400">AI</span>
                </span>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent/10 text-white border border-primary/30'
                        : 'text-slate-400 hover:bg-surface-soft hover:text-slate-100 border border-transparent',
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
