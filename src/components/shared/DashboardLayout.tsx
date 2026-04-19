import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Avatar } from '@components/ui/Avatar'
import { useAuthStore } from '@store/authStore'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function LogoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

const navItems: NavItem[] = [
  {
    to: '/painel/agenda',
    label: 'Agenda',
    icon: <CalendarIcon />,
  },
]

export function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const displayName = user?.full_name ?? 'Dr. Lucas Silva'
  const displaySubtitle = user?.email ?? 'Profissional de saúde'

  function handleLogout() {
    logout()
    void navigate('/entrar')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-[220px] flex-shrink-0 flex-col bg-[#052e16]">
        {/* Logo area */}
        <div
          className="flex items-center gap-3 px-5 py-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <LogoIcon />
          </div>
          <span className="text-[17px] font-bold leading-none tracking-tight text-white">
            NoPonto
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-0.5 px-[10px] py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-[10px] rounded-lg px-3 py-[10px] text-[13px] transition-colors',
                  isActive
                    ? 'bg-primary-600 font-semibold text-white'
                    : 'font-normal text-white/55 hover:bg-white/[.08]',
                ].join(' ')
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div
          className="px-4 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <Avatar name={displayName} size={36} badge />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-white">
                {displayName}
              </p>
              <p
                className="truncate text-[11px] leading-tight"
                style={{ color: 'rgba(255,255,255,.45)' }}
              >
                {displaySubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-1.5 text-left text-[12px] font-medium transition-colors hover:bg-white/[.08]"
            style={{ color: 'rgba(255,255,255,.4)' }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  )
}
