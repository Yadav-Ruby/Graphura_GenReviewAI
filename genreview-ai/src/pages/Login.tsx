import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas bg-grid-mesh bg-[size:32px_32px] px-4">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <motion.div
        className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm rounded-2xl border border-surface-border bg-surface/80 p-8 shadow-soft backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent shadow-glow">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-white">
            GenReview <span className="text-primary-400">AI</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your intelligence dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-soft px-3 py-2.5 focus-within:border-primary/50">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@restaurant.com"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-soft px-3 py-2.5 focus-within:border-primary/50">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-surface-border bg-surface-soft accent-primary-500" />
              Remember me
            </label>
            <a href="#" className="text-primary-400 hover:text-primary-300">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo environment — any credentials will sign you in.
        </p>
      </motion.div>
    </div>
  )
}
