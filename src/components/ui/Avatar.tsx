import { cn } from '@utils/cn'

interface AvatarProps {
  name: string
  size?: number
  src?: string
  badge?: boolean
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ''
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

export function Avatar({ name, size = 40, src, badge = false, className }: AvatarProps) {
  const initials = getInitials(name)

  return (
    <div
      className={cn('relative inline-flex flex-shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #16a34a, #0d9488)',
            fontSize: Math.round(size * 0.35),
          }}
          aria-label={name}
        >
          {initials}
        </div>
      )}

      {badge && (
        <span
          className="absolute bottom-0 right-0 block rounded-full border-2 border-white bg-primary-500"
          style={{ width: 10, height: 10 }}
          aria-label="Online"
        />
      )}
    </div>
  )
}
