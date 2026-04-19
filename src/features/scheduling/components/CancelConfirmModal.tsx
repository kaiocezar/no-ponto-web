import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { AppointmentLookup } from '@/types/api'

interface CancelConfirmModalProps {
  appointment: AppointmentLookup
  isLoading?: boolean
  errorMessage?: string | null
  onClose: () => void
  onConfirm: (reason?: string) => void
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

export function CancelConfirmModal({
  appointment,
  isLoading = false,
  errorMessage,
  onClose,
  onConfirm,
}: CancelConfirmModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    const trimmedReason = reason.trim()
    onConfirm(trimmedReason ? trimmedReason : undefined)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar cancelamento"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Confirmar cancelamento</h2>
          <p className="mt-1 text-sm text-slate-600">
            Confira os dados abaixo antes de cancelar o agendamento.
          </p>
        </div>

        <div className="space-y-4 px-6 py-4">
          <dl className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
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
          </dl>

          <Input
            label="Motivo (opcional)"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value)
            }}
            placeholder="Ex: Imprevisto, mudança de plano..."
            maxLength={500}
          />

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Voltar
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            Confirmar cancelamento
          </Button>
        </div>
      </div>
    </div>
  )
}
