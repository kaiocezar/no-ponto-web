import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'

import { useClientAuth } from './useClientAuth'
import { useAuthStore } from '@store/authStore'

describe('useClientAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: 'refresh-token',
      isAuthenticated: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('faz silent refresh e restaura access token', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { access: 'new-access-token' } })

    const { result } = renderHook(() => useClientAuth())

    await waitFor(() => {
      expect(result.current.isInitializing).toBe(false)
    })
    expect(useAuthStore.getState().accessToken).toBe('new-access-token')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('executa logout quando refresh falha', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh failed'))

    const { result } = renderHook(() => useClientAuth())

    await waitFor(() => {
      expect(result.current.isInitializing).toBe(false)
    })
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().refreshToken).toBeNull()
  })
})
