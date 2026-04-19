import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'

import { AppointmentDetailDrawer } from './AppointmentDetailDrawer'

vi.mock('../hooks/useAppointmentActions', () => ({
  useAppointmentActions: () => ({
    confirm: { isPending: false, mutate: vi.fn() },
    complete: { isPending: false, mutate: vi.fn() },
    noShow: { isPending: false, mutate: vi.fn() },
    cancel: { isPending: false, mutate: vi.fn() },
  }),
}))

const detailPending = {
  id: '1',
  public_id: 'AGD-1',
  client_name: 'C',
  client_phone: '+5511977777777',
  client_email: '',
  service: { id: 's', name: 'Srv', duration_minutes: 60 },
  status: 'pending_confirmation' as const,
  start_datetime: '2026-04-22T10:00:00Z',
  end_datetime: '2026-04-22T11:00:00Z',
  origin: 'online' as const,
  notes: '',
  internal_notes: '',
  cancelled_by: null,
  cancellation_reason: null,
  created_at: '2026-04-22T09:00:00Z',
}

const detailConfirmed = { ...detailPending, status: 'confirmed' as const }

function renderWithClient(ui: React.ReactElement) {
  const qc = new QueryClient()
  const wrap = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
  return render(ui, { wrapper: wrap })
}

describe('AppointmentDetailDrawer', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mostra Confirmar quando status pending_confirmation', async () => {
    vi.spyOn(providerAppointmentsApi, 'get').mockResolvedValue(detailPending)
    renderWithClient(<AppointmentDetailDrawer appointmentId="1" open onClose={() => undefined} />)
    expect(await screen.findByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Concluir' })).not.toBeInTheDocument()
  })

  it('mostra Concluir quando status confirmed', async () => {
    vi.spyOn(providerAppointmentsApi, 'get').mockResolvedValue(detailConfirmed)
    renderWithClient(<AppointmentDetailDrawer appointmentId="1" open onClose={() => undefined} />)
    expect(await screen.findByRole('button', { name: 'Concluir' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument()
  })
})
