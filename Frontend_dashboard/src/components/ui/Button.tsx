import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantMap: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-500 to-accent text-white shadow-glow hover:brightness-110',
  secondary: 'bg-surface-soft text-slate-100 border border-surface-border hover:bg-surface',
  ghost: 'bg-transparent text-slate-300 hover:bg-surface-soft',
  outline: 'bg-transparent border border-surface-border text-slate-200 hover:bg-surface-soft',
}

const sizeMap: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
          variantMap[variant],
          sizeMap[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
