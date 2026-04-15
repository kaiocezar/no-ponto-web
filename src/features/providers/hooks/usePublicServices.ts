import { useQuery } from '@tanstack/react-query'

import { providersApi } from '../api/providersApi'
import { providerKeys } from './providerKeys'

export function usePublicServices(slug: string) {
  return useQuery({
    queryKey: providerKeys.publicServices(slug),
    queryFn: () => providersApi.getPublicServices(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
  })
}
