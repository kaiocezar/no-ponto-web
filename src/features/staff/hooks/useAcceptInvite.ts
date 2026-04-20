import { useQuery, useMutation } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'

export function useValidateInvite(token: string) {
  return useQuery({
    queryKey: ['invite', 'validate', token],
    queryFn: () => staffApi.validateInvite(token),
    enabled: !!token,
    staleTime: 1000 * 60,
    retry: false,
  })
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (data: { token: string; full_name?: string; password?: string }) =>
      staffApi.acceptInvite(data),
  })
}
