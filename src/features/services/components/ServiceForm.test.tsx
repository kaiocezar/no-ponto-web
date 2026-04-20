import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockCreateMutateAsync = vi.fn().mockResolvedValue({})
const mockUpdateMutateAsync = vi.fn().mockResolvedValue({})

vi.mock('../hooks/useCreateService', () => ({
  useCreateService: () => ({
    mutateAsync: mockCreateMutateAsync,
  }),
}))

vi.mock('../hooks/useUpdateService', () => ({
  useUpdateService: () => ({
    mutateAsync: mockUpdateMutateAsync,
  }),
}))

vi.mock('@features/staff/hooks/useProviderStaff', () => ({
  useProviderStaff: () => ({
    data: [],
    isLoading: false,
  }),
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

import { ServiceForm } from './ServiceForm'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('ServiceForm', () => {
  it('exibe erro de validação quando duration_minutes está vazio', async () => {
    const user = userEvent.setup()
    render(<ServiceForm service={null} onClose={vi.fn()} />, { wrapper })

    // Clear the duration field so it becomes NaN
    const durationInput = screen.getByLabelText(/duração \(min\)/i)
    await user.clear(durationInput)

    await user.click(screen.getByRole('button', { name: /criar serviço/i }))

    await waitFor(() => {
      expect(screen.getByText(/duração obrigatória/i)).toBeInTheDocument()
    })
  })

  it('toggle "A combinar" deixa price=null no submit', async () => {
    const user = userEvent.setup()
    mockCreateMutateAsync.mockClear()

    render(<ServiceForm service={null} onClose={vi.fn()} />, { wrapper })

    const nameInput = screen.getByRole('textbox', { name: /nome/i })
    await user.type(nameInput, 'Massagem')

    // Toggle "A combinar"
    await user.click(screen.getByRole('checkbox', { name: /a combinar/i }))

    const durationInput = screen.getByLabelText(/duração \(min\)/i)
    await user.clear(durationInput)
    await user.type(durationInput, '60')

    await user.click(screen.getByRole('button', { name: /criar serviço/i }))

    await waitFor(() => {
      expect(mockCreateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ price: null }),
      )
    })
  })
})
