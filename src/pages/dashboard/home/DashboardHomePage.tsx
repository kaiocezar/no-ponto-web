import { CancellationRateBadge } from '@features/dashboard/components/CancellationRateBadge'
import { NextAppointmentsList } from '@features/dashboard/components/NextAppointmentsList'
import { StatCard } from '@features/dashboard/components/StatCard'
import { useDashboard } from '@features/dashboard/hooks/useDashboard'

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export default function DashboardHomePage() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Painel</h1>
        <CancellationRateBadge rate={data.week.cancellation_rate} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Hoje"
          value={data.today.total}
          icon={<CalendarIcon />}
          to="/painel/agenda"
          trend={`Mês: ${String(data.month.total)}`}
        />
        <StatCard
          label="Confirmados"
          value={data.today.confirmed}
          icon={<CalendarIcon />}
          to="/painel/agenda?status=confirmed"
        />
        <StatCard
          label="Pendentes"
          value={data.today.pending_confirmation}
          icon={<CalendarIcon />}
          to="/painel/agenda?status=pending_confirmation"
        />
        <StatCard
          label="Cancelados"
          value={data.today.cancelled}
          icon={<CalendarIcon />}
          to="/painel/agenda?status=cancelled"
        />
      </div>

      <NextAppointmentsList items={data.next_appointments} />
    </div>
  )
}
