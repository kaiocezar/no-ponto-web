import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { authApi } from '../api/authApi'
import { useAuthStore } from '@store/authStore'
import type { RegisterPayload } from '@/types/api'

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined
    if (data) {
      // Tenta mensagens comuns da API Django
      if (typeof data['detail'] === 'string') return data['detail']
      if (typeof data['non_field_errors'] === 'string') return data['non_field_errors']
      const nonField = data['non_field_errors']
      if (Array.isArray(nonField) && typeof nonField[0] === 'string') return nonField[0]
      // Pega o primeiro campo com erro
      const firstKey = Object.keys(data)[0]
      if (firstKey) {
        const fieldError = data[firstKey]
        if (Array.isArray(fieldError) && typeof fieldError[0] === 'string') return fieldError[0]
        if (typeof fieldError === 'string') return fieldError
      }
    }
    if (error.response?.status === 400) return 'Dados inválidos. Verifique as informações.'
    if (error.response?.status === 409) return 'Email já cadastrado.'
  }
  return 'Erro ao criar conta. Tente novamente.'
}

export function useRegister() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setTokens(data.tokens.access, data.tokens.refresh)
      setUser(data.user)
      void navigate('/configurar-perfil')
    },
  })

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.isError ? extractErrorMessage(mutation.error) : null,
  }
}
