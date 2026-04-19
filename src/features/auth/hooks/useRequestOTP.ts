import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/authApi'

export function useRequestOTP() {
  return useMutation({
    mutationFn: (phone: string) => authApi.requestOTP(phone),
  })
}
