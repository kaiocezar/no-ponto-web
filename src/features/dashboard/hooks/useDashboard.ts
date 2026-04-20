import { useQuery } from '@tanstack/react-query'

import { dashboardApi } from '../api/dashboardApi'
import { dashboardKeys } from './dashboardKeys'

export function useDashboard(date?: string) {
  return useQuery({
    queryKey: dashboardKeys.home(date),
    queryFn: () => dashboardApi.get(date),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
