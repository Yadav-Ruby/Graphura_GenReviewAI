import { LucideIcon, Sparkles } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Props {
  title: string
  description: string
  icon: LucideIcon
}

export default function PlaceholderPage({ title, description, icon: Icon }: Props) {
  return (
    <DashboardLayout title={title}>
      <div className="flex min-h-[70vh] items-center justify-center pt-2">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent shadow-glow">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-5 font-display text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
          <Button className="mt-6" size="sm">
            <Sparkles className="h-3.5 w-3.5" />
            Explore module
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
