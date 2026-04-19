import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/authApi'
import { useAuthStore } from '@store/authStore'

export function useCompleteProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (fullName: string) => authApi.completeProfile(fullName),
    onSuccess: (user) => {
      setUser(user)
    },
  })
}
