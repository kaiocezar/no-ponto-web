import { useQuery } from '@tanstack/react-query'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'
import { providerAppointmentKeys } from './providerAppointmentKeys'

export function useProviderAppointments(
  dateFrom: string,
  dateTo: string,
  status?: string,
  staffId?: string,
) {
  return useQuery({
    queryKey: providerAppointmentKeys.list(dateFrom, dateTo, status, staffId),
    queryFn: () =>
      providerAppointmentsApi.list({
        date_from: dateFrom,
        date_to: dateTo,
        status,
        staff_id: staffId,
      }),
    enabled: Boolean(dateFrom && dateTo),
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}
