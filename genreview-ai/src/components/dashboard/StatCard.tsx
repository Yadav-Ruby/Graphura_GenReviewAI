import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  decimals?: number
  change: number
  icon: LucideIcon
  sparkline: number[]
  accent?: 'primary' | 'success' | 'warning' | 'danger'
  delay?: number
}

function useCountUp(target: number, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start: number | null = null
    let raf: number
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value.toFixed(decimals)
}

const accentMap = {
  primary: 'text-primary-400 bg-primary-500/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
}

export function StatCard({
  label,
  value,
  suffix = '',
  decimals = 0,
  change,
  icon: Icon,
  sparkline,
  accent = 'primary',
  delay = 0,
}: StatCardProps) {
  const displayValue = useCountUp(value, decimals)
  const isPositive = change >= 0
  const chartData = sparkline.map((v, i) => ({ i, v }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="relative overflow-hidden p-5 hover:border-primary/40 transition-colors duration-300">
        <div className="flex items-start justify-between">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              isPositive ? 'text-success' : 'text-danger',
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(change)}%
          </span>
        </div>

        <p className="mt-4 font-mono text-2xl font-semibold tabular text-white">
          {displayValue}
          {suffix}
        </p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>

        <div className="mt-3 h-8 w-full opacity-70">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isPositive ? '#22C55E' : '#EF4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
