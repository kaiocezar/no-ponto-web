import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { authApi } from '../api/authApi'
import { useVerifyOTP } from './useVerifyOTP'
import { useAuthStore } from '@store/authStore'

describe('useVerifyOTP', () => {
  it('propaga is_new_user e atualiza tokens no store', async () => {
    const verifySpy = vi.spyOn(authApi, 'verifyOTP').mockResolvedValue({
      access: 'access-token',
      refresh: 'refresh-token',
      is_new_user: true,
    })
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })

    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useVerifyOTP(), { wrapper })

    result.current.mutate({ phone: '+5511999999999', code: '123456' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('access-token')
    })
    expect(result.current.data?.is_new_user).toBe(true)
    expect(verifySpy).toHaveBeenCalledWith('+5511999999999', '123456')
  })
})
