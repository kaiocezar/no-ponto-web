import { useMutation, useQueryClient } from '@tanstack/react-query'

import { servicesApi } from '../api/servicesApi'
import { serviceKeys } from './useProviderServices'
import type { Service } from '@/types/api'

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Service> & { staff_ids?: string[] }) =>
      servicesApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
    },
  })
}
