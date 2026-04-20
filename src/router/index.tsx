import { createBrowserRouter } from 'react-router-dom'

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
const DashboardHomePage = lazy(() => import('@/pages/dashboard/home/DashboardHomePage'))
const ClientsPage = lazy(() => import('@/pages/dashboard/clients/ClientsPage'))
const ClientDetailPage = lazy(() => import('@/pages/dashboard/clients/ClientDetailPage'))
const ProviderReviewsPage = lazy(() => import('@/pages/dashboard/reviews/ProviderReviewsPage'))
const ProfileSetupPage = lazy(() => import('@/pages/dashboard/profile-setup/ProfileSetupPage'))
const WorkingHoursPage = lazy(() => import('@/pages/dashboard/settings/WorkingHoursPage'))
const ScheduleBlocksPage = lazy(() => import('@/pages/dashboard/settings/ScheduleBlocksPage'))
const ServicesPage = lazy(() => import('@/pages/dashboard/services/ServicesPage'))
const StaffPage = lazy(() => import('@/pages/dashboard/staff/StaffPage'))
const AcceptInvitePage = lazy(() => import('@/pages/public/invite/AcceptInvitePage'))
const ReviewPage = lazy(() => import('@/pages/public/review/ReviewPage'))
const MyAppointmentsPage = lazy(() => import('@/pages/account/appointments/MyAppointmentsPage'))
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
      {
        path: '/convite',
        element: withSuspense(AcceptInvitePage),
      },
      {
        path: '/avaliar/:token',
        element: withSuspense(ReviewPage),
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
        element: withSuspense(DashboardHomePage),
      },
      {
        path: '/painel/agenda',
        element: withSuspense(DashboardAgendaPage),
      },
      {
        path: '/painel/clientes',
        element: withSuspense(ClientsPage),
      },
      {
        path: '/painel/clientes/:phone',
        element: withSuspense(ClientDetailPage),
      },
      {
        path: '/painel/avaliacoes',
        element: withSuspense(ProviderReviewsPage),
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
      {
        path: '/painel/servicos',
        element: withSuspense(ServicesPage),
      },
      {
        path: '/painel/equipe',
        element: withSuspense(StaffPage),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute requiredRole="client">
        <PublicLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/minha-conta/agendamentos',
        element: withSuspense(MyAppointmentsPage),
      },
    ],
  },

  // ── 404 ────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
])
