import { useState } from 'react'

import axios from 'axios'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'

import { useManualBooking } from '../hooks/useManualBooking'

import type { Service } from '@/types/api'

interface ManualBookingModalProps {
  open: boolean
  onClose: () => void
  services: Service[]
}

export function ManualBookingModal({ open, onClose, services }: ManualBookingModalProps) {
  const booking = useManualBooking()
  const [serviceId, setServiceId] = useState('')
  const [startLocal, setStartLocal] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [origin, setOrigin] = useState<'phone' | 'walk_in'>('phone')
  const [notes, setNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  function reset() {
    setServiceId('')
    setStartLocal('')
    setClientName('')
    setClientPhone('')
    setOrigin('phone')
    setNotes('')
    setInternalNotes('')
    setError(null)
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError(null)
    if (!serviceId || !startLocal || !clientName.trim() || !clientPhone.trim()) {
      setError('Preencha serviço, data/hora, cliente e telefone.')
      return
    }
    const start = new Date(startLocal)
    if (Number.isNaN(start.getTime())) {
      setError('Data/hora inválida.')
      return
    }
    booking.mutate(
      {
        service_id: serviceId,
        start_datetime: start.toISOString(),
        client_name: clientName.trim(),
        client_phone: clientPhone.trim(),
        origin,
        notes: notes.trim(),
        internal_notes: internalNotes.trim(),
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 409) {
            setError('Conflito de horário: escolha outro slot.')
            return
          }
          setError('Não foi possível criar o agendamento.')
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-booking-title"
      >
        <h2 id="manual-booking-title" className="text-lg font-semibold text-slate-900">
          Novo agendamento
        </h2>
        <p className="mt-1 text-sm text-slate-500">Registo manual (telefone ou presencial).</p>

        {services.length === 0 ? (
          <p className="mt-4 text-sm text-amber-700">Cadastre um serviço antes de agendar.</p>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="svc">
                Serviço
              </label>
              <select
                id="svc"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value)
                }}
              >
                <option value="">Selecione…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="dt">
                Data e hora de início
              </label>
              <Input
                id="dt"
                type="datetime-local"
                value={startLocal}
                onChange={(e) => {
                  setStartLocal(e.target.value)
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="cn">
                Cliente
              </label>
              <Input
                id="cn"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value)
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="ph">
                Telefone
              </label>
              <Input
                id="ph"
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value)
                }}
              />
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-slate-600">Origem</span>
              <div className="flex gap-3 text-sm">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="origin"
                    checked={origin === 'phone'}
                    onChange={() => {
                      setOrigin('phone')
                    }}
                  />
                  Telefone
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="origin"
                    checked={origin === 'walk_in'}
                    onChange={() => {
                      setOrigin('walk_in')
                    }}
                  />
                  Presencial
                </label>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="nt">
                Observações
              </label>
              <textarea
                id="nt"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={2}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value)
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="in">
                Notas internas
              </label>
              <textarea
                id="in"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={2}
                value={internalNotes}
                onChange={(e) => {
                  setInternalNotes(e.target.value)
                }}
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset()
                  onClose()
                }}
              >
                Voltar
              </Button>
              <Button type="submit" isLoading={booking.isPending}>
                Guardar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
