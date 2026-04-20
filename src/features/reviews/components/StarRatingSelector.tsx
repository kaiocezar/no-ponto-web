import { cn } from '@utils/cn'

interface StarRatingSelectorProps {
  value: number
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
}

export function StarRatingSelector({ value, onChange }: StarRatingSelectorProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Seleção de estrelas">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          className={cn(
            'text-2xl leading-none',
            value >= star ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400',
          )}
          onClick={() => {
            onChange(star as 1 | 2 | 3 | 4 | 5)
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
