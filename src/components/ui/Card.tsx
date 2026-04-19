import { cn } from '@utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white',
        className,
      )}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}
    >
      {children}
    </div>
  )
}
