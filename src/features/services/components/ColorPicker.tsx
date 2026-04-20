import { cn } from '@utils/cn'

const PALETTE = [
  '#15803d',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#0891b2',
  '#64748b',
]

interface ColorPickerProps {
  value: string | null
  onChange: (color: string | null) => void
  error?: string
}

export function ColorPicker({ value, onChange, error }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold text-slate-700">Cor (opcional)</span>
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => { onChange(value === color ? null : color) }}
            className={cn(
              'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
              value === color ? 'border-slate-800 ring-2 ring-offset-1 ring-slate-400' : 'border-transparent',
            )}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-slate-500">Hex customizado:</label>
        <input
          type="text"
          maxLength={7}
          placeholder="#aabbcc"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? null : v)
          }}
          className="w-28 rounded-lg border-[1.5px] border-slate-200 px-2 py-1 text-[12px] focus:border-primary-600 focus:outline-none"
        />
        {value && (
          <span
            className="inline-block h-5 w-5 rounded-full border border-slate-200"
            style={{ backgroundColor: value }}
          />
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
