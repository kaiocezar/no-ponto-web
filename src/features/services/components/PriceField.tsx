import { cn } from '@utils/cn'

interface PriceFieldProps {
  value: string | null
  onChange: (value: string | null) => void
  error?: string
}

export function PriceField({ value, onChange, error }: PriceFieldProps) {
  const isCombinar = value === null

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold text-slate-700">Preço</span>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          disabled={isCombinar}
          value={isCombinar ? '' : value}
          onChange={(e) => { onChange(e.target.value === '' ? '' : e.target.value) }}
          className={cn(
            'w-36 rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px]',
            'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-colors',
            isCombinar && 'opacity-40',
            error && 'border-red-500',
          )}
          aria-label="Preço"
        />
        <label className="flex cursor-pointer items-center gap-1.5 text-[13px] text-slate-600">
          <input
            type="checkbox"
            checked={isCombinar}
            onChange={(e) => { onChange(e.target.checked ? null : '') }}
            className="h-4 w-4 rounded border-slate-300 accent-primary-600"
          />
          A combinar
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
