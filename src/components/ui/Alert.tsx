import { cn } from '@utils/cn'

interface AlertProps {
  variant: 'error' | 'success' | 'info' | 'warning'
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<AlertProps['variant'], string> = {
  success: 'bg-primary-50 border-primary-600/30 text-primary-700',
  error: 'bg-red-50 border-red-600/30 text-red-600',
  info: 'bg-blue-50 border-blue-600/30 text-blue-600',
  warning: 'bg-amber-50 border-amber-500/30 text-amber-600',
}

export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
