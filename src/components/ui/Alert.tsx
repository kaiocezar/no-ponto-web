import { cn } from '@utils/cn'

interface AlertProps {
  variant: 'error' | 'success' | 'info' | 'warning'
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<AlertProps['variant'], string> = {
  error: 'bg-red-50 border-red-300 text-red-800',
  success: 'bg-green-50 border-green-300 text-green-800',
  info: 'bg-blue-50 border-blue-300 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
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
