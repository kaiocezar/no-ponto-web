import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AcceptInvitePage from './AcceptInvitePage'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockValidate = vi.fn()
const mockAccept = vi.fn()

vi.mock('@features/staff/hooks/useAcceptInvite', () => ({
  useValidateInvite: (token: string) => mockValidate(token) as unknown,
  useAcceptInvite: () => ({ mutateAsync: mockAccept }),
}))

function wrapper({ children, search = '' }: { children: React.ReactNode; search?: string }) {
  const qc = new QueryClient()
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/convite${search}`]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AcceptInvitePage', () => {
  it('exibe mensagem de link inválido quando não há token', () => {
    mockValidate.mockReturnValue({ data: null, isLoading: false, isError: false })
    render(<AcceptInvitePage />, { wrapper: ({ children }) => wrapper({ children, search: '' }) })
    expect(screen.getByText(/link de convite inválido/i)).toBeInTheDocument()
  })

  it('exibe formulário quando token é válido', async () => {
    mockValidate.mockReturnValue({
      data: { provider_name: 'Clínica Saúde', staff_name: 'Dr. João', role: 'practitioner', invite_email: 'joao@ex.com' },
      isLoading: false,
      isError: false,
    })
    render(
      <AcceptInvitePage />,
      { wrapper: ({ children }) => wrapper({ children, search: '?token=valid-token' }) },
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /aceitar convite/i })).toBeInTheDocument()
      expect(screen.getByText(/clínica saúde/i)).toBeInTheDocument()
    })
  })

  it('exibe erro quando token é inválido/expirado', () => {
    mockValidate.mockReturnValue({ data: null, isLoading: false, isError: true })
    render(
      <AcceptInvitePage />,
      { wrapper: ({ children }) => wrapper({ children, search: '?token=expired' }) },
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/convite inválido ou expirado/i)
  })

  it('aceita o convite ao submeter o formulário', async () => {
    const user = userEvent.setup()
    mockValidate.mockReturnValue({
      data: { provider_name: 'Clínica Saúde', staff_name: 'Dr. João', role: 'practitioner', invite_email: 'joao@ex.com' },
      isLoading: false,
      isError: false,
    })
    mockAccept.mockResolvedValue({})

    render(
      <AcceptInvitePage />,
      { wrapper: ({ children }) => wrapper({ children, search: '?token=abc123' }) },
    )

    const submitBtn = await screen.findByRole('button', { name: /aceitar convite/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockAccept).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'abc123' }),
      )
    })
  })
})
