import type { CalendarApi } from '@fullcalendar/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AgendaHeader } from './AgendaHeader'

describe('AgendaHeader', () => {
  it('alterna dia/semana e aciona hoje', async () => {
    const user = userEvent.setup()
    const prev = vi.fn()
    const next = vi.fn()
    const today = vi.fn()
    const changeView = vi.fn()
    const api = { prev, next, today, changeView } as unknown as CalendarApi
    const onView = vi.fn()
    const onNew = vi.fn()

    render(
      <AgendaHeader
        getCalendarApi={() => api}
        calendarView="timeGridWeek"
        onCalendarViewChange={onView}
        onNewBooking={onNew}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(today).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Dia' }))
    expect(onView).toHaveBeenCalledWith('timeGridDay')
    expect(changeView).toHaveBeenCalledWith('timeGridDay')

    await user.click(screen.getByRole('button', { name: 'Semana' }))
    expect(onView).toHaveBeenCalledWith('timeGridWeek')

    await user.click(screen.getByRole('button', { name: 'Novo agendamento' }))
    expect(onNew).toHaveBeenCalled()
  })
})
