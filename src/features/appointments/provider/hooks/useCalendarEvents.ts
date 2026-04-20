import { useMemo } from 'react'

import type { EventInput } from '@fullcalendar/core'

import type { AppointmentStatus, ProviderAppointmentListRow } from '@/types/api'

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending_confirmation: '#ca8a04',
  confirmed: '#15803d',
  cancelled: '#64748b',
  completed: '#2563eb',
  no_show: '#b91c1c',
  awaiting_payment: '#7c3aed',
}

function eventTitle(a: ProviderAppointmentListRow): string {
  return `${a.client_name} — ${a.service.name}`
}

export function useCalendarEvents(appointments: ProviderAppointmentListRow[]): EventInput[] {
  return useMemo(
    () =>
      appointments.map((a) => {
        const color = a.service.color ?? STATUS_COLORS[a.status]
        return {
          id: a.id,
          title: eventTitle(a),
          start: a.start_datetime,
          end: a.end_datetime,
          backgroundColor: color,
          borderColor: color,
          extendedProps: { status: a.status },
        }
      }),
    [appointments],
  )
}

export { STATUS_COLORS, eventTitle }
