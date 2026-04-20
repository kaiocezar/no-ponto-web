import { useQuery } from '@tanstack/react-query'

import { servicesApi } from '../api/servicesApi'

export const serviceKeys = {
  all: ['provider', 'services'] as const,
  list: () => ['provider', 'services', 'list'] as const,
}

export function useProviderServices() {
  return useQuery({
    queryKey: serviceKeys.all,
    queryFn: servicesApi.list,
    staleTime: 1000 * 60 * 5,
  })
}
