import { cn } from '@/utils/cn'

export interface SlotGridItem {
  start_datetime: string
  end_datetime: string
}

interface SlotGridProps {
  slots: SlotGridItem[]
  selectedStartDatetime?: string | null
  onSelect: (slot: SlotGridItem) => void
  formatLabel: (slot: SlotGridItem) => string
  disabled?: boolean
}

export function SlotGrid({
  slots,
  selectedStartDatetime,
  onSelect,
  formatLabel,
  disabled = false,
}: SlotGridProps) {
  return (
    <div
      role="list"
      aria-label="Horários disponíveis"
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5"
    >
      {slots.map((slot) => {
        const isSelected = slot.start_datetime === selectedStartDatetime
        return (
          <button
            key={slot.start_datetime}
            type="button"
            role="listitem"
            onClick={() => {
              onSelect(slot)
            }}
            aria-pressed={isSelected}
            aria-label={`Horário ${formatLabel(slot)}`}
            disabled={disabled}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              isSelected
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50',
              disabled && 'cursor-not-allowed opacity-70',
            )}
          >
            {formatLabel(slot)}
          </button>
        )
      })}
    </div>
  )
}
