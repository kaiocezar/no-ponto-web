import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PriceField } from './PriceField'

describe('PriceField', () => {
  it('exibe input de preço habilitado quando valor é string', () => {
    render(<PriceField value="100" onChange={vi.fn()} />)
    const input = screen.getByRole('spinbutton', { name: 'Preço' })
    expect(input).not.toBeDisabled()
    expect(input).toHaveValue(100)
  })

  it('desabilita input e marca checkbox quando value=null (A combinar)', () => {
    render(<PriceField value={null} onChange={vi.fn()} />)
    const input = screen.getByRole('spinbutton', { name: 'Preço' })
    expect(input).toBeDisabled()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('chama onChange com null ao marcar "A combinar"', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PriceField value="50" onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('chama onChange com string vazia ao desmarcar "A combinar"', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PriceField value={null} onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
