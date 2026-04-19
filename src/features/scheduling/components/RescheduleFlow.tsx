import { useState } from 'react'
import axios from 'axios'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import type { AppointmentLookup, RescheduleOption } from '@/types/api'
import { useRescheduleAppointment } from '../hooks/useRescheduleAppointment'
import { useRescheduleOptions } from '../hooks/useRescheduleOptions'
import { SlotGrid, type SlotGridItem } from './SlotGrid'

interface RescheduleFlowProps {
  appointmentId: string
  phone: string
  onSuccess?: (appointment: AppointmentLookup) => void
}

function formatSlotLabel(slot: SlotGridItem): string {
  return new Date(slot.start_datetime).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function mapOptionsToGridSlots(options: RescheduleOption[]): SlotGridItem[] {
  return options.map((slot) => ({
    start_datetime: slot.start_datetime,
    end_datetime: slot.end_datetime,
  }))
}

interface RescheduleConflictPayload {
  code?: string
  available_slots?: RescheduleOption[]
}

export function RescheduleFlow({ appointmentId, phone, onSuccess }: RescheduleFlowProps) {
  const [selectedStart, setSelectedStart] = useState<string | null>(null)
  const [conflictSlots, setConflictSlots] = useState<RescheduleOption[] | null>(null)

  const rescheduleOptionsQuery = useRescheduleOptions(appointmentId, phone)
  const rescheduleMutation = useRescheduleAppointment()

  const visibleSlots = conflictSlots ?? rescheduleOptionsQuery.data ?? []
  const gridSlots = mapOptionsToGridSlots(visibleSlots)

  const handleSelectSlot = (slot: SlotGridItem) => {
    setSelectedStart(slot.start_datetime)
  }

  const handleReschedule = () => {
    if (!selectedStart) return

    rescheduleMutation.mutate(
      {
        appointmentId,
        payload: {
          phone,
          start_datetime: selectedStart,
        },
      },
      {
        onSuccess: (appointment) => {
          setConflictSlots(null)
          onSuccess?.(appointment)
        },
        onError: (error) => {
          if (!axios.isAxiosError<RescheduleConflictPayload>(error)) return

          const response = error.response
          if (!response || response.status !== 409 || response.data.code !== 'slot_taken') return

          const availableSlots = response.data.available_slots ?? []
          setConflictSlots(availableSlots)
          setSelectedStart(availableSlots[0]?.start_datetime ?? null)
        },
      },
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Fluxo de reagendamento</h2>
      <p className="text-sm text-slate-600">
        Selecione um dos próximos horários disponíveis para concluir o reagendamento.
      </p>

      {rescheduleMutation.isSuccess && (
        <Alert variant="success">
          Reagendamento concluído com sucesso. Novo código: {rescheduleMutation.data.public_id}.
        </Alert>
      )}

      {rescheduleOptionsQuery.isLoading && (
        <p className="text-sm text-slate-500">Carregando horários disponíveis...</p>
      )}

      {rescheduleOptionsQuery.isError && (
        <Alert variant="error">Não foi possível carregar os horários para reagendamento agora.</Alert>
      )}

      {!rescheduleOptionsQuery.isLoading && !rescheduleOptionsQuery.isError && visibleSlots.length === 0 && (
        <Alert variant="info">Não há horários disponíveis para os próximos dias.</Alert>
      )}

      {visibleSlots.length > 0 && (
        <>
          {conflictSlots && (
            <Alert variant="warning">
              O horário selecionado acabou de ser ocupado. Atualizamos a lista com os horários ainda
              disponíveis.
            </Alert>
          )}

          <SlotGrid
            slots={gridSlots}
            selectedStartDatetime={selectedStart}
            onSelect={handleSelectSlot}
            formatLabel={formatSlotLabel}
            disabled={rescheduleMutation.isPending || rescheduleMutation.isSuccess}
          />

          <Button
            type="button"
            onClick={handleReschedule}
            isLoading={rescheduleMutation.isPending}
            disabled={!selectedStart || rescheduleMutation.isSuccess}
            className="w-full"
          >
            Confirmar reagendamento
          </Button>
        </>
      )}

      {rescheduleMutation.isError &&
        !axios.isAxiosError<RescheduleConflictPayload>(rescheduleMutation.error) && (
        <Alert variant="error">Não foi possível reagendar agora. Tente novamente em instantes.</Alert>
      )}
    </div>
  )
}
