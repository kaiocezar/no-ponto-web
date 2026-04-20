import { useMutation } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'

export function useResendInvite() {
  return useMutation({
    mutationFn: (id: string) => staffApi.resendInvite(id),
  })
}
