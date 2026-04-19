import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/authApi'
import { useAuthStore } from '@store/authStore'

interface VerifyOTPInput {
  phone: string
  code: string
}

export function useVerifyOTP() {
  const setTokens = useAuthStore((s) => s.setTokens)

  return useMutation({
    mutationFn: ({ phone, code }: VerifyOTPInput) => authApi.verifyOTP(phone, code),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
    },
  })
}
