import type { MyAppointmentsFilterStatus } from '@/types/api'

export const myAppointmentsKeys = {
  all: ['my-appointments'] as const,
  list: (status: MyAppointmentsFilterStatus, cursor?: string) =>
    [...myAppointmentsKeys.all, status, cursor ?? 'first'] as const,
}
