import { useQuery } from '@tanstack/react-query'

import { providersApi } from '../api/providersApi'
import { providerKeys } from './providerKeys'

export function useCategories() {
  return useQuery({
    queryKey: providerKeys.categories(),
    queryFn: providersApi.getCategories,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  })
}
