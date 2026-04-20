import { useCallback, useMemo, useState } from 'react'

import type { CalendarApi, DatesSetArg } from '@fullcalendar/core'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import toast from 'react-hot-toast'

import { AgendaHeader, type AgendaCalendarView } from '@features/appointments/provider/components/AgendaHeader'
import { AppointmentDetailDrawer } from '@features/appointments/provider/components/AppointmentDetailDrawer'
import { ManualBookingModal } from '@features/appointments/provider/components/ManualBookingModal'
import { StaffFilterTabs } from '@features/appointments/provider/components/StaffFilterTabs'
import { useCalendarEvents } from '@features/appointments/provider/hooks/useCalendarEvents'
import { useNewAppointmentDetector } from '@features/appointments/provider/hooks/useNewAppointmentDetector'
import { useProviderAppointments } from '@features/appointments/provider/hooks/useProviderAppointments'
import { useProviderProfile } from '@features/providers/hooks/useProviderProfile'
import { useProviderStaff } from '@features/staff/hooks/useProviderStaff'

import type { ProviderAppointmentListRow } from '@/types/api'

function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${String(y)}-${m}-${day}`
}

function inclusiveEndDate(endExclusive: Date): string {
  const d = new Date(endExclusive.getTime() - 1)
  return toYmd(d)
}

export default function AgendaPage() {
  const { data: profile } = useProviderProfile()
  const tz = profile?.timezone ?? 'America/Sao_Paulo'

  const [range, setRange] = useState<{ from: string; to: string }>({ from: '', to: '' })
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null)
  const [calendarView, setCalendarView] = useState<AgendaCalendarView>('timeGridWeek')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)

  const { data: staff = [] } = useProviderStaff()
  const activeStaff = staff.filter((s) => s.is_active)

  const listQuery = useProviderAppointments(range.from, range.to, undefined, selectedStaffId ?? undefined)
  const appointments = listQuery.data ?? []
  const events = useCalendarEvents(appointments)

  const onNewAppointments = useCallback((items: ProviderAppointmentListRow[]) => {
    for (const item of items) {
      toast.success(`Novo agendamento: ${item.client_name} — ${item.service.name}`)
    }
  }, [])

  useNewAppointmentDetector(appointments, {
    enabled: Boolean(range.from),
    onNewAppointments,
  })

  const services = useMemo(() => profile?.services ?? [], [profile?.services])

  const onDatesSet = useCallback((arg: DatesSetArg) => {
    setCalendarApi(arg.view.calendar)
    const from = toYmd(arg.start)
    const to = inclusiveEndDate(arg.end)
    setRange({ from, to })
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {activeStaff.length > 1 && (
        <div className="border-b border-slate-100 bg-white px-4 py-2">
          <StaffFilterTabs
            staff={activeStaff}
            selectedStaffId={selectedStaffId}
            onChange={setSelectedStaffId}
          />
        </div>
      )}
      <AgendaHeader
        getCalendarApi={() => calendarApi}
        calendarView={calendarView}
        onCalendarViewChange={(v) => {
          setCalendarView(v)
        }}
        onNewBooking={() => {
          setModalOpen(true)
        }}
      />
      <div className="min-h-0 flex-1 p-2" style={{ minHeight: 'min(720px, calc(100vh - 7rem))' }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={ptBrLocale}
          timeZone={tz}
          headerToolbar={false}
          height="100%"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator
          events={events}
          datesSet={onDatesSet}
          eventClick={(info) => {
            setSelectedId(info.event.id)
            setDrawerOpen(true)
            return undefined
          }}
        />
      </div>

      <AppointmentDetailDrawer
        appointmentId={selectedId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedId(null)
          return undefined
        }}
      />

      <ManualBookingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        services={services}
      />
    </div>
  )
}
