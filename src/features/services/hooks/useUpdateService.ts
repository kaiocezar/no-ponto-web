import { useMutation, useQueryClient } from '@tanstack/react-query'

import { servicesApi } from '../api/servicesApi'
import { serviceKeys } from './useProviderServices'
import type { Service } from '@/types/api'

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> & { staff_ids?: string[] } }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
    },
  })
}
