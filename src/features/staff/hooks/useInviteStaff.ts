import { useMutation, useQueryClient } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'
import { staffKeys } from './staffKeys'

export function useInviteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; invite_email: string; role: string }) =>
      staffApi.invite(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.all })
    },
  })
}
