import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Staff } from '@/types/api'
import { staffApi } from '../api/staffApi'
import { staffKeys } from './staffKeys'

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) =>
      staffApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}
