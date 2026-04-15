import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { providersApi } from '../api/providersApi'
import { providerKeys } from './providerKeys'
import type { ProviderProfile } from '@/types/api'

export function useProviderProfile() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: providerKeys.me(),
    queryFn: providersApi.getMyProfile,
    staleTime: 1000 * 60 * 5,
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProviderProfile>) => providersApi.updateMyProfile(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerKeys.me() })
    },
  })

  const publishMutation = useMutation({
    mutationFn: providersApi.publishProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerKeys.me() })
    },
  })

  return {
    ...query,
    update: updateMutation,
    publish: publishMutation,
  }
}
