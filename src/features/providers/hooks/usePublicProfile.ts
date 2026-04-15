import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { providersApi } from '../api/providersApi'
import { providerKeys } from './providerKeys'

export function usePublicProfile(slug: string) {
  return useQuery({
    queryKey: providerKeys.public(slug),
    queryFn: () => providersApi.getPublicProfile(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return false
      return failureCount < 2
    },
  })
}
