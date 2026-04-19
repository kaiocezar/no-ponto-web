import { createBrowserRouter, Navigate } from 'react-router-dom'

import { PublicLayout } from '@/components/shared/PublicLayout'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'

// ── Lazy imports (code splitting por rota) ────────────────────────────────────
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('@/pages/public/home/HomePage'))
const RegisterPage = lazy(() => import('@/pages/public/register/RegisterPage'))
const LoginPage = lazy(() => import('@/pages/public/login/LoginPage'))
const ProviderProfilePage = lazy(() => import('@/pages/public/provider-profile/ProviderProfilePage'))
const BookingPage = lazy(() => import('@/pages/public/booking/BookingPage'))
const BookingConfirmationPage = lazy(
  () => import('@/pages/public/booking/BookingConfirmationPage'),
)
const AppointmentPublicPage = lazy(() => import('@/pages/public/booking/AppointmentPublicPage'))
const DashboardAgendaPage = lazy(() => import('@/pages/dashboard/agenda/AgendaPage'))
const ProfileSetupPage = lazy(() => import('@/pages/dashboard/profile-setup/ProfileSetupPage'))
const WorkingHoursPage = lazy(() => import('@/pages/dashboard/settings/WorkingHoursPage'))
const ScheduleBlocksPage = lazy(() => import('@/pages/dashboard/settings/ScheduleBlocksPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // ── Rotas públicas ──────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: withSuspense(HomePage),
      },
      {
        path: '/cadastro',
        element: withSuspense(RegisterPage),
      },
      {
        path: '/login',
        element: withSuspense(LoginPage),
      },
      {
        path: '/:slug/agendar',
        element: withSuspense(BookingPage),
      },
      {
        path: '/:slug/agendamento/:publicId',
        element: withSuspense(BookingConfirmationPage),
      },
      {
        path: '/agendamento/:publicId',
        element: withSuspense(AppointmentPublicPage),
      },
      // /:slug deve ser a última rota pública para não conflitar com as anteriores
      {
        path: '/:slug',
        element: withSuspense(ProviderProfilePage),
      },
    ],
  },

  // ── Rotas protegidas (painel do prestador) ──────────────────────────────────
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/painel',
        element: <Navigate to="/painel/agenda" replace />,
      },
      {
        path: '/painel/agenda',
        element: withSuspense(DashboardAgendaPage),
      },
      {
        path: '/configurar-perfil',
        element: withSuspense(ProfileSetupPage),
      },
      {
        path: '/painel/configuracoes/horarios',
        element: withSuspense(WorkingHoursPage),
      },
      {
        path: '/painel/configuracoes/bloqueios',
        element: withSuspense(ScheduleBlocksPage),
      },
    ],
  },

  // ── 404 ────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
])
