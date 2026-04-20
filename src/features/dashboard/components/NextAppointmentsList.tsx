import { Link } from 'react-router-dom'

import { Card } from '@components/ui/Card'
import type { DashboardNextAppointment } from '@/types/api'

interface NextAppointmentsListProps {
  items: DashboardNextAppointment[]
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmado',
  pending_confirmation: 'Pendente',
}

export function NextAppointmentsList({ items }: NextAppointmentsListProps) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Próximos agendamentos</h2>
        <Link to="/painel/agenda" className="text-xs font-medium text-primary-700 hover:underline">
          Ver agenda
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum agendamento próximo para hoje.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
              <p className="text-sm font-medium text-slate-900">{item.client_name}</p>
              <p className="text-xs text-slate-500">
                {item.service_name} · {formatDateTime(item.start_datetime)}
              </p>
              <Link
                to={`/painel/agenda?status=${item.status}`}
                className="mt-1 inline-flex text-xs font-medium text-primary-700 hover:underline"
              >
                {statusLabel[item.status] ?? item.status}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
