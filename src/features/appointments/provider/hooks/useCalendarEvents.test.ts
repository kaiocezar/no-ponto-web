import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { eventTitle, STATUS_COLORS, useCalendarEvents } from './useCalendarEvents'

import type { ProviderAppointmentListRow } from '@/types/api'

const base = (over: Partial<ProviderAppointmentListRow>): ProviderAppointmentListRow => ({
  id: 'id-1',
  public_id: 'AGD-AAAA',
  client_name: 'Ana',
  client_phone: '+5511999999999',
  service: { id: 's1', name: 'Corte', duration_minutes: 30 },
  status: 'confirmed',
  start_datetime: '2026-04-20T10:00:00Z',
  end_datetime: '2026-04-20T10:30:00Z',
  origin: 'online',
  ...over,
})

describe('useCalendarEvents', () => {
  it('mapeia status para cor e título', () => {
    const rows: [ProviderAppointmentListRow, ProviderAppointmentListRow] = [
      base({}),
      base({ id: 'id-2', status: 'pending_confirmation' }),
    ]
    const row0 = rows[0]
    const { result } = renderHook(() => useCalendarEvents(rows))
    const events = result.current
    expect(events).toHaveLength(2)
    expect(events[0]?.title).toBe(eventTitle(row0))
    expect(events[0]?.backgroundColor).toBe(STATUS_COLORS.confirmed)
    expect(events[1]?.backgroundColor).toBe(STATUS_COLORS.pending_confirmation)
  })
})
