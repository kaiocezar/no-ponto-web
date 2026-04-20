import { useMutation, useQueryClient } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'
import { staffKeys } from './staffKeys'

export function useDeactivateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => staffApi.deactivate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}
