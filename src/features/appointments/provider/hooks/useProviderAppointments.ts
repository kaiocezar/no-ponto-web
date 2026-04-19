import { useQuery } from '@tanstack/react-query'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'
import { providerAppointmentKeys } from './providerAppointmentKeys'

export function useProviderAppointments(dateFrom: string, dateTo: string, status?: string) {
  return useQuery({
    queryKey: providerAppointmentKeys.list(dateFrom, dateTo, status),
    queryFn: () => providerAppointmentsApi.list({ date_from: dateFrom, date_to: dateTo, status }),
    enabled: Boolean(dateFrom && dateTo),
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}
