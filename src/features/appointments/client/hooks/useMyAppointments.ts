import { useQuery } from '@tanstack/react-query'

import { myAppointmentsApi } from '../api/myAppointmentsApi'
import { myAppointmentsKeys } from './myAppointmentsKeys'
import type { MyAppointmentsFilterStatus } from '@/types/api'

export function useMyAppointments(status: MyAppointmentsFilterStatus, cursor?: string) {
  return useQuery({
    queryKey: myAppointmentsKeys.list(status, cursor),
    queryFn: () => myAppointmentsApi.list(status, cursor),
    staleTime: 30_000,
  })
}
