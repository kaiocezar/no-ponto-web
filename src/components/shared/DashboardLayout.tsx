import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar — implementar na task MVP-P1-08 */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-4">
          <span className="text-xl font-bold text-primary-600">Agendador</span>
        </div>
        <nav className="mt-4 px-2">
          <a
            href="/painel/agenda"
            className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Agenda
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
