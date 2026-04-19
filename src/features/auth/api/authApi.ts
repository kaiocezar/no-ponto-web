import api from '@lib/api'
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  AuthTokens,
  RequestOTPPayload,
  VerifyOTPPayload,
  VerifyOTPResponse,
  CompleteProfilePayload,
  UpdateMePayload,
  User,
} from '@/types/api'

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

  requestOTP: async (phone: RequestOTPPayload['phone']): Promise<void> => {
    await api.post('/accounts/request-otp/', { phone })
  },

  verifyOTP: async (phone: VerifyOTPPayload['phone'], code: VerifyOTPPayload['code']): Promise<VerifyOTPResponse> => {
    const { data } = await api.post<VerifyOTPResponse>('/accounts/verify-otp/', { phone, code })
    return data
  },

  completeProfile: async (fullName: CompleteProfilePayload['full_name']): Promise<User> => {
    const { data } = await api.post<User>('/accounts/complete-profile/', { full_name: fullName })
    return data
  },

  updateMe: async (payload: UpdateMePayload): Promise<User> => {
    const { data } = await api.patch<User>('/accounts/me/', payload)
    return data
  },
}
