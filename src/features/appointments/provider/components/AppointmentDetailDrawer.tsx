import { useQuery } from '@tanstack/react-query'

import { Button } from '@components/ui/Button'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'
import { providerAppointmentKeys } from '../hooks/providerAppointmentKeys'
import { useAppointmentActions } from '../hooks/useAppointmentActions'

import type { AppointmentStatus } from '@/types/api'

interface AppointmentDetailDrawerProps {
  appointmentId: string | null
  open: boolean
  onClose: () => void
}

function formatRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${s.toLocaleString('pt-BR')} — ${e.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

export function AppointmentDetailDrawer({ appointmentId, open, onClose }: AppointmentDetailDrawerProps) {
  const { confirm, complete, noShow, cancel } = useAppointmentActions()

  const detailQuery = useQuery({
    queryKey: appointmentId ? providerAppointmentKeys.detail(appointmentId) : ['provider-appointment', 'idle'],
    queryFn: async () => {
      if (!appointmentId) {
        throw new Error('appointmentId ausente')
      }
      return providerAppointmentsApi.get(appointmentId)
    },
    enabled: open && Boolean(appointmentId),
  })

  const a = detailQuery.data
  const status: AppointmentStatus | undefined = a?.status

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" role="presentation">
      <button
        type="button"
        className="h-full flex-1 cursor-default border-0 bg-transparent"
        aria-label="Fechar painel"
        onClick={onClose}
      />
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agenda-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="agenda-drawer-title" className="text-lg font-semibold text-slate-900">
            Agendamento
          </h2>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 text-sm text-slate-700">
          {detailQuery.isLoading && <p>Carregando…</p>}
          {detailQuery.isError && <p className="text-red-600">Não foi possível carregar.</p>}
          {a && (
            <div className="space-y-3">
              <p>
                <span className="font-medium text-slate-900">Cliente:</span> {a.client_name}
              </p>
              <p>
                <span className="font-medium text-slate-900">Telefone:</span> {a.client_phone}
              </p>
              {a.client_email ? (
                <p>
                  <span className="font-medium text-slate-900">Email:</span> {a.client_email}
                </p>
              ) : null}
              <p>
                <span className="font-medium text-slate-900">Serviço:</span> {a.service.name}
              </p>
              <p>
                <span className="font-medium text-slate-900">Quando:</span> {formatRange(a.start_datetime, a.end_datetime)}
              </p>
              <p>
                <span className="font-medium text-slate-900">Status:</span> {a.status}
              </p>
              <p>
                <span className="font-medium text-slate-900">Origem:</span> {a.origin}
              </p>
              {a.notes ? (
                <p>
                  <span className="font-medium text-slate-900">Observações:</span> {a.notes}
                </p>
              ) : null}
              {a.internal_notes ? (
                <p>
                  <span className="font-medium text-slate-900">Notas internas:</span> {a.internal_notes}
                </p>
              ) : null}
              {a.cancellation_reason ? (
                <p>
                  <span className="font-medium text-slate-900">Motivo cancelamento:</span>{' '}
                  {a.cancellation_reason}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {a && (
          <div className="flex flex-col gap-2 border-t border-slate-200 p-4">
            {status === 'pending_confirmation' ? (
              <Button
                type="button"
                isLoading={confirm.isPending}
                onClick={() => {
                  confirm.mutate(a.id, { onSuccess: onClose })
                }}
              >
                Confirmar
              </Button>
            ) : null}
            {status === 'confirmed' ? (
              <>
                <Button
                  type="button"
                  isLoading={complete.isPending}
                  onClick={() => {
                    complete.mutate(a.id, { onSuccess: onClose })
                  }}
                >
                  Concluir
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  isLoading={noShow.isPending}
                  onClick={() => {
                    noShow.mutate(a.id, { onSuccess: onClose })
                  }}
                >
                  Não compareceu
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  isLoading={cancel.isPending}
                  onClick={() => {
                    cancel.mutate({ id: a.id }, { onSuccess: onClose })
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClose()
              }}
            >
              Fechar
            </Button>
          </div>
        )}
      </aside>
    </div>
  )
}
