import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'positive' | 'neutral' | 'negative' | 'info' | 'warning' | 'default'

const variantMap: Record<Variant, string> = {
  positive: 'bg-success/10 text-success border-success/30',
  neutral: 'bg-warning/10 text-warning border-warning/30',
  negative: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-primary/10 text-primary-400 border-primary/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  default: 'bg-surface-soft text-slate-300 border-surface-border',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
