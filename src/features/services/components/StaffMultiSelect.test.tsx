import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { StaffMultiSelect } from './StaffMultiSelect'

vi.mock('@features/staff/hooks/useProviderStaff', () => ({
  useProviderStaff: () => ({
    data: [
      { id: 's1', name: 'Ana Silva', role: 'practitioner', is_active: true, avatar_url: null, invite_email: null, user: null },
      { id: 's2', name: 'Carlos Lima', role: 'manager', is_active: true, avatar_url: null, invite_email: null, user: null },
      { id: 's3', name: 'Beatriz Souza', role: 'owner', is_active: false, avatar_url: null, invite_email: null, user: null },
    ],
    isLoading: false,
  }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('StaffMultiSelect', () => {
  it('exibe apenas staff ativos', () => {
    render(<StaffMultiSelect value={[]} onChange={vi.fn()} />, { wrapper })
    expect(screen.getByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument()
    expect(screen.queryByText('Beatriz Souza')).not.toBeInTheDocument()
  })

  it('marca checkbox ao clicar no profissional', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffMultiSelect value={[]} onChange={onChange} />, { wrapper })
    await user.click(screen.getByText('Ana Silva'))
    expect(onChange).toHaveBeenCalledWith(['s1'])
  })

  it('desmarca ao clicar novamente em selecionado', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffMultiSelect value={['s1', 's2']} onChange={onChange} />, { wrapper })
    await user.click(screen.getByText('Ana Silva'))
    expect(onChange).toHaveBeenCalledWith(['s2'])
  })
})
