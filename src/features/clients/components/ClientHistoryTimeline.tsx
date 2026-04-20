import { Card } from '@components/ui/Card'
import type { ProviderClientAppointment } from '@/types/api'

interface ClientHistoryTimelineProps {
  items: ProviderClientAppointment[]
}

const statusLabel: Record<string, string> = {
  completed: 'Concluído',
  confirmed: 'Confirmado',
  pending_confirmation: 'Pendente',
  cancelled: 'Cancelado',
  no_show: 'Não compareceu',
}

export function ClientHistoryTimeline({ items }: ClientHistoryTimelineProps) {
  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Timeline de atendimentos</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum atendimento encontrado com os filtros.</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-l-2 border-primary-100 pl-3">
              <p className="text-sm font-medium text-slate-900">{item.service_name}</p>
              <p className="text-xs text-slate-500">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(item.start_datetime))}
              </p>
              <p className="text-xs text-slate-600">
                Status: {statusLabel[item.status] ?? item.status}
                {item.staff_name ? ` · Profissional: ${item.staff_name}` : ''}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
