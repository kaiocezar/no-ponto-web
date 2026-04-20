import { useQuery } from '@tanstack/react-query'

import { clientsApi, type ClientAppointmentsFilters } from '../api/clientsApi'
import { clientKeys } from './clientKeys'

export function useClientAppointments(phone: string, filters: ClientAppointmentsFilters = {}) {
  return useQuery({
    queryKey: clientKeys.appointments(phone, filters),
    queryFn: () => clientsApi.appointments(phone, filters),
    enabled: Boolean(phone),
    staleTime: 30_000,
  })
}
