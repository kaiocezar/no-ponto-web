import { useMutation, useQueryClient } from '@tanstack/react-query'

import { servicesApi } from '../api/servicesApi'
import { serviceKeys } from './useProviderServices'

export function useToggleServiceStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? servicesApi.activate(id) : servicesApi.deactivate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
    },
  })
}
