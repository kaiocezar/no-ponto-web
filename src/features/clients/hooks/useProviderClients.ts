import { useQuery } from '@tanstack/react-query'

import { clientsApi } from '../api/clientsApi'
import { clientKeys } from './clientKeys'

export function useProviderClients(search?: string) {
  return useQuery({
    queryKey: clientKeys.list(search),
    queryFn: () => clientsApi.list(search),
    staleTime: 60_000,
  })
}
