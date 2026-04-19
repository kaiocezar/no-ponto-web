import { useEffect, useState } from 'react'
import axios from 'axios'

import { useAuthStore } from '@store/authStore'

type ClientAuthStatus = 'idle' | 'loading' | 'ready'

export function useClientAuth() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const setTokens = useAuthStore((s) => s.setTokens)
  const logout = useAuthStore((s) => s.logout)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [status, setStatus] = useState<ClientAuthStatus>('idle')

  useEffect(() => {
    if (!isAuthenticated || accessToken || !refreshToken) {
      setStatus('ready')
      return
    }

    let cancelled = false
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    setStatus('loading')

    axios
      .post<{ access: string }>(`${baseURL}/api/v1/accounts/token/refresh/`, {
        refresh: refreshToken,
      })
      .then(({ data }) => {
        if (cancelled) return
        setTokens(data.access, refreshToken)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        logout()
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [accessToken, isAuthenticated, logout, refreshToken, setTokens])

  return {
    isInitializing: status === 'idle' || status === 'loading',
  }
}
