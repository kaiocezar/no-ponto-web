import { useQuery } from '@tanstack/react-query'

import { appointmentsApi } from '../api/appointmentsApi'

const rescheduleKeys = {
  options: (appointmentId: string, phone: string) =>
    ['appointments', 'reschedule-options', appointmentId, phone] as const,
}

export function useRescheduleOptions(
  appointmentId: string | undefined,
  phone: string | undefined,
) {
  return useQuery({
    queryKey: rescheduleKeys.options(appointmentId ?? '', phone ?? ''),
    queryFn: () => {
      if (!appointmentId || !phone) {
        throw new Error('appointmentId e phone são obrigatórios para reagendamento.')
      }
      return appointmentsApi.getRescheduleOptions(appointmentId, phone)
    },
    enabled: Boolean(appointmentId && phone),
    staleTime: 1000 * 60,
    retry: false,
  })
}
