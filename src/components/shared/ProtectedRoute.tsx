import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'

import { useAuthStore } from '@store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'client' | 'provider' | 'admin' | 'staff'
}

type RefreshStatus = 'idle' | 'loading' | 'done' | 'failed'

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setTokens = useAuthStore((s) => s.setTokens)
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  const needsSilentRefresh = isAuthenticated && !accessToken && !!refreshToken

  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>(
    needsSilentRefresh ? 'loading' : 'idle',
  )

  useEffect(() => {
    if (!needsSilentRefresh) return

    let cancelled = false

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    axios
      .post<{ access: string }>(
        `${baseURL}/api/v1/accounts/token/refresh/`,
        { refresh: refreshToken },
      )
      .then(({ data }) => {
        if (cancelled) return
        setTokens(data.access, refreshToken)
        setRefreshStatus('done')
      })
      .catch(() => {
        if (cancelled) return
        logout()
        setRefreshStatus('failed')
      })

    return () => {
      cancelled = true
    }
    // Executa apenas no mount — dependências intencionalmente vazias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Caso 4: não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Refresh falhou → logout já foi chamado, redireciona
  if (refreshStatus === 'failed') {
    return <Navigate to="/" replace />
  }

  // Silent refresh em andamento → spinner inline
  if (refreshStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  // Verificação de role (aplica após refresh concluído ou no happy path)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  // Caso 3 (happy path pós-login) e Caso 2 (pós silent refresh)
  return <>{children}</>
}
