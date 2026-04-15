import api from '@lib/api'
import type { RegisterPayload, LoginPayload, AuthResponse, AuthTokens } from '@/types/api'

export const authApi = {
  /**
   * Cadastro de novo usuário.
   * POST /accounts/register/
   * Espera retornar { user, tokens: { access, refresh } }
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/accounts/register/', payload)
    return data
  },

  /**
   * Login com email/senha.
   * POST /accounts/login/ — SimpleJWT retorna { access, refresh }
   */
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>('/accounts/login/', payload)
    return data
  },
}
