import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { StaffFilterTabs } from './StaffFilterTabs'
import type { Staff } from '@/types/api'

const makeStaff = (id: string, name: string): Staff => ({
  id,
  name,
  role: 'practitioner',
  is_active: true,
  avatar_url: null,
  invite_email: null,
  user: null,
})

describe('StaffFilterTabs', () => {
  it('não renderiza com 0 profissionais', () => {
    const { container } = render(
      <StaffFilterTabs staff={[]} selectedStaffId={null} onChange={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('não renderiza com apenas 1 profissional', () => {
    const { container } = render(
      <StaffFilterTabs
        staff={[makeStaff('s1', 'Ana')]}
        selectedStaffId={null}
        onChange={vi.fn()}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza tabs quando há 2 ou mais profissionais', () => {
    render(
      <StaffFilterTabs
        staff={[makeStaff('s1', 'Ana'), makeStaff('s2', 'Bruno')]}
        selectedStaffId={null}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('tab', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Ana' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Bruno' })).toBeInTheDocument()
  })

  it('chama onChange com null ao clicar em "Todos"', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <StaffFilterTabs
        staff={[makeStaff('s1', 'Ana'), makeStaff('s2', 'Bruno')]}
        selectedStaffId="s1"
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('tab', { name: 'Todos' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('chama onChange com o id do profissional ao clicar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <StaffFilterTabs
        staff={[makeStaff('s1', 'Ana'), makeStaff('s2', 'Bruno')]}
        selectedStaffId={null}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('tab', { name: 'Bruno' }))
    expect(onChange).toHaveBeenCalledWith('s2')
  })
})
