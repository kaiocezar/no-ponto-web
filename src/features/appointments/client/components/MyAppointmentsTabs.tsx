import { cn } from '@utils/cn'
import type { MyAppointmentsFilterStatus } from '@/types/api'

interface MyAppointmentsTabsProps {
  active: MyAppointmentsFilterStatus
  onChange: (next: MyAppointmentsFilterStatus) => void
}

export function MyAppointmentsTabs({ active, onChange }: MyAppointmentsTabsProps) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => {
          onChange('upcoming')
        }}
        className={cn(
          'rounded-md px-3 py-1.5 text-sm font-medium',
          active === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600',
        )}
      >
        Próximos
      </button>
      <button
        type="button"
        onClick={() => {
          onChange('past')
        }}
        className={cn(
          'rounded-md px-3 py-1.5 text-sm font-medium',
          active === 'past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600',
        )}
      >
        Passados
      </button>
    </div>
  )
}
