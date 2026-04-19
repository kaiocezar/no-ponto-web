import { Button } from '@/components/ui/Button'
import type { AppointmentLookup } from '@/types/api'

interface AppointmentDetailProps {
  appointment: AppointmentLookup
  onCancel?: () => void
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

function getStatusLabel(status: AppointmentLookup['status']): string {
  switch (status) {
    case 'pending_confirmation':
      return 'Aguardando confirmação'
    case 'confirmed':
      return 'Confirmado'
    case 'cancelled':
      return 'Cancelado'
    case 'completed':
      return 'Concluído'
    case 'no_show':
      return 'Não compareceu'
    case 'awaiting_payment':
      return 'Aguardando pagamento'
    default:
      return status
  }
}

export function AppointmentDetail({ appointment, onCancel }: AppointmentDetailProps) {
  const canCancel = appointment.can_cancel ?? false

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Detalhes do agendamento</h2>
        <p className="text-sm text-slate-500">Código: {appointment.public_id}</p>
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Cliente</dt>
          <dd className="text-slate-900">{appointment.client_name}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Serviço</dt>
          <dd className="text-slate-900">{appointment.service.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Data e hora</dt>
          <dd className="text-slate-900">{formatDateTime(appointment.start_datetime)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Status</dt>
          <dd className="text-slate-900">{getStatusLabel(appointment.status)}</dd>
        </div>
      </dl>

      {canCancel ? (
        <Button type="button" variant="danger" onClick={onCancel}>
          Cancelar agendamento
        </Button>
      ) : (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Este agendamento não pode mais ser cancelado pelo link público.
        </p>
      )}
    </div>
  )
}
