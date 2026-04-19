interface AppointmentBadgeProps {
  count: number
}

export function AppointmentBadge({ count }: AppointmentBadgeProps) {
  if (count <= 0) return null
  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}
