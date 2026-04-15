import type { AvailableSlot } from '@/types/api'
import { useAvailability } from '../hooks/useAvailability'

interface SlotPickerProps {
  slug: string
  serviceId: string
  date: string
  staffId?: string
  selectedSlot?: string | null
  onSelect: (slot: AvailableSlot) => void
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

export function SlotPicker({
  slug,
  serviceId,
  date,
  staffId,
  selectedSlot,
  onSelect,
}: SlotPickerProps) {
  const { data: slots, isLoading, isError } = useAvailability({ slug, serviceId, date, staffId })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8" aria-label="Carregando horários disponíveis">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <span className="ml-2 text-sm text-gray-500">Carregando horários...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Erro ao carregar horários disponíveis. Tente novamente.
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        Nenhum horário disponível para esta data.
      </p>
    )
  }

  return (
    <div
      role="list"
      aria-label="Horários disponíveis"
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5"
    >
      {slots.map((slot) => {
        const isSelected = slot.start === selectedSlot
        return (
          <button
            key={slot.start}
            role="listitem"
            onClick={() => { onSelect(slot) }}
            aria-pressed={isSelected}
            aria-label={`Horário ${formatTime(slot.start)}`}
            className={[
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              isSelected
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50',
            ].join(' ')}
          >
            {formatTime(slot.start)}
          </button>
        )
      })}
    </div>
  )
}
