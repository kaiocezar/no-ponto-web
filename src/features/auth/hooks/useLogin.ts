import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { authApi } from '../api/authApi'
import { useAuthStore } from '@store/authStore'
import type { LoginPayload } from '@/types/api'

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined
    if (data) {
      if (typeof data['detail'] === 'string') return data['detail']
      const nonField = data['non_field_errors']
      if (Array.isArray(nonField) && typeof nonField[0] === 'string') return nonField[0]
    }
    if (error.response?.status === 401) return 'Email ou senha incorretos.'
    if (error.response?.status === 400) return 'Dados inválidos.'
  }
  return 'Erro ao fazer login. Tente novamente.'
}

export function useLogin() {
  const navigate = useNavigate()
  const { setTokens } = useAuthStore()

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      void navigate('/painel/agenda')
    },
  })

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.isError ? extractErrorMessage(mutation.error) : null,
  }
}
