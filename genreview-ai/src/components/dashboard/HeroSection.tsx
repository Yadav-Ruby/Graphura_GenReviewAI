import { motion } from 'framer-motion'
import { Sparkles, Brain } from 'lucide-react'

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-hero-glow px-6 py-10 md:px-10 md:py-14"
    >
      <motion.div
        className="pointer-events-none absolute -right-10 top-6 h-32 w-32 rounded-full bg-accent/20 blur-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/3 bottom-0 h-24 w-24 rounded-full bg-primary-500/20 blur-3xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-400">
            <Sparkles className="h-3 w-3" />
            Live intelligence feed
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-4xl">
            Welcome to GenReview AI
          </h2>
          <p className="mt-2 text-sm text-slate-400 md:text-base">
            AI-powered Restaurant Review Intelligence Dashboard
          </p>
        </div>

        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center md:h-32 md:w-32">
          <span className="absolute h-full w-full rounded-full border border-primary/40 animate-pulseRing" />
          <span className="absolute h-full w-full rounded-full border border-accent/30 animate-pulseRing [animation-delay:0.8s]" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent shadow-glow animate-floaty md:h-20 md:w-20">
            <Brain className="h-8 w-8 text-white md:h-9 md:w-9" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
