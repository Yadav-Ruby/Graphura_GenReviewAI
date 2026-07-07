import { motion } from 'framer-motion'
import { UploadCloud, Smile, FileText, FileDown, Sparkles } from 'lucide-react'

const actions = [
  { label: 'Upload Dataset', icon: UploadCloud, gradient: 'from-primary-500 to-primary-700' },
  { label: 'Run Sentiment Analysis', icon: Smile, gradient: 'from-accent to-primary-600' },
  { label: 'Generate Summary', icon: FileText, gradient: 'from-primary-500 to-accent' },
  { label: 'Export Report', icon: FileDown, gradient: 'from-primary-600 to-accent-600' },
  { label: 'Generate Reviews', icon: Sparkles, gradient: 'from-accent-600 to-primary-500' },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          className={`flex flex-col items-start gap-3 rounded-2xl bg-gradient-to-br ${a.gradient} p-4 text-left shadow-soft`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <a.icon className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-sm font-medium text-white">{a.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
