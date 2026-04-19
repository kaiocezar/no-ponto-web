import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNewAppointmentDetector } from './useNewAppointmentDetector'

import type { ProviderAppointmentListRow } from '@/types/api'

const row = (id: string): ProviderAppointmentListRow => ({
  id,
  public_id: 'AGD-X',
  client_name: 'B',
  client_phone: '+5511988888888',
  service: { id: 's', name: 'Srv', duration_minutes: 60 },
  status: 'confirmed',
  start_datetime: '2026-04-21T12:00:00Z',
  end_datetime: '2026-04-21T13:00:00Z',
  origin: 'online',
})

describe('useNewAppointmentDetector', () => {
  it('não dispara na primeira carga', () => {
    const cb = vi.fn()
    const initial = [row('a')]
    renderHook(
      ({ items }) => {
        useNewAppointmentDetector(items, { enabled: true, onNewAppointments: cb })
      },
      { initialProps: { items: initial } },
    )
    expect(cb).not.toHaveBeenCalled()
  })

  it('dispara ao aparecer ID novo', () => {
    const cb = vi.fn()
    const { rerender } = renderHook(
      ({ items }) => {
        useNewAppointmentDetector(items, { enabled: true, onNewAppointments: cb })
      },
      { initialProps: { items: [row('a')] } },
    )
    rerender({ items: [row('a'), row('b')] })
    expect(cb).toHaveBeenCalledTimes(1)
    const firstArg = cb.mock.calls[0]?.[0] as ProviderAppointmentListRow[] | undefined
    expect(firstArg).toHaveLength(1)
    expect(firstArg?.[0]?.id).toBe('b')
  })

  it('não dispara em atualização só de status (mesmo ID)', () => {
    const cb = vi.fn()
    const { rerender } = renderHook(
      ({ items }) => {
        useNewAppointmentDetector(items, { enabled: true, onNewAppointments: cb })
      },
      { initialProps: { items: [row('a')] } },
    )
    rerender({ items: [{ ...row('a'), status: 'cancelled' }] })
    expect(cb).not.toHaveBeenCalled()
  })
})
