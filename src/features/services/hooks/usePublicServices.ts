import { useQuery } from '@tanstack/react-query'

import { servicesApi } from '../api/servicesApi'

export function usePublicServices(slug: string) {
  return useQuery({
    queryKey: ['public', 'services', slug],
    queryFn: () => servicesApi.publicList(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
  })
}
