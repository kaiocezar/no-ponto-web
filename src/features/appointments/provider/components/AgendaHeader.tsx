import type { CalendarApi } from '@fullcalendar/core'

import { Button } from '@components/ui/Button'

export type AgendaCalendarView = 'timeGridWeek' | 'timeGridDay'

interface AgendaHeaderProps {
  getCalendarApi: () => CalendarApi | null
  calendarView: AgendaCalendarView
  onCalendarViewChange: (v: AgendaCalendarView) => void
  onNewBooking: () => void
}

export function AgendaHeader({
  getCalendarApi,
  calendarView,
  onCalendarViewChange,
  onNewBooking,
}: AgendaHeaderProps) {
  const api = () => getCalendarApi()

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => api()?.prev()}>
          Anterior
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => api()?.next()}>
          Próximo
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => api()?.today()}>
          Hoje
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
          <button
            type="button"
            className={
              calendarView === 'timeGridWeek'
                ? 'rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white'
                : 'rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50'
            }
            onClick={() => {
              onCalendarViewChange('timeGridWeek')
              api()?.changeView('timeGridWeek')
            }}
          >
            Semana
          </button>
          <button
            type="button"
            className={
              calendarView === 'timeGridDay'
                ? 'rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white'
                : 'rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50'
            }
            onClick={() => {
              onCalendarViewChange('timeGridDay')
              api()?.changeView('timeGridDay')
            }}
          >
            Dia
          </button>
        </div>
        <Button type="button" size="sm" onClick={onNewBooking}>
          Novo agendamento
        </Button>
      </div>
    </header>
  )
}
