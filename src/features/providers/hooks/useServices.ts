import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { providersApi } from '../api/providersApi'
import { providerKeys } from './providerKeys'
import type { CreateServicePayload } from '@/types/api'

export function useServices() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: providerKeys.myServices(),
    queryFn: providersApi.listMyServices,
    staleTime: 1000 * 60 * 5,
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateServicePayload) => providersApi.createService(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerKeys.myServices() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => providersApi.deleteService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerKeys.myServices() })
    },
  })

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    create: createMutation,
    remove: deleteMutation,
  }
}
