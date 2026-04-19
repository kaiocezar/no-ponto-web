import { forwardRef } from 'react'
import { cn } from '@utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg px-3 py-[10px] text-[13px] text-slate-900 placeholder-slate-400',
            'border-[1.5px] border-slate-200',
            'focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20',
            'transition-colors',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : '',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
