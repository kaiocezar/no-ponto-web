import { Link } from 'react-router-dom'

import { Card } from '@components/ui/Card'
import { cn } from '@utils/cn'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  trend?: string
  to?: string
}

export function StatCard({ label, value, icon, trend, to }: StatCardProps) {
  const content = (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {trend ? <p className="mt-1 text-xs text-slate-500">{trend}</p> : null}
        </div>
        <div className="rounded-lg bg-primary-50 p-2 text-primary-700">{icon}</div>
      </div>
    </Card>
  )

  if (!to) return content

  return (
    <Link to={to} className={cn('block transition-transform hover:-translate-y-0.5')}>
      {content}
    </Link>
  )
}
