import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PhoneInputStep } from './PhoneInputStep'

describe('PhoneInputStep', () => {
  it('formata o telefone durante digitacao', () => {
    render(<PhoneInputStep isPending={false} onSubmit={vi.fn()} />)

    const input = screen.getByLabelText('Telefone')
    fireEvent.change(input, { target: { value: '+5511988887777' } })

    expect(input).toHaveValue('+55 11 98888-7777')
  })

  it('mostra erro para telefone invalido e nao envia', () => {
    const onSubmit = vi.fn()
    render(<PhoneInputStep isPending={false} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '+55 11 9999-9999' } })
    fireEvent.click(screen.getByRole('button', { name: 'Receber código' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(
      screen.getByText('Informe um telefone válido no formato +55 XX XXXXX-XXXX.'),
    ).toBeInTheDocument()
  })

  it('envia telefone normalizado em e164', () => {
    const onSubmit = vi.fn()
    render(<PhoneInputStep isPending={false} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '+55 11 99999-9999' } })
    fireEvent.click(screen.getByRole('button', { name: 'Receber código' }))

    expect(onSubmit).toHaveBeenCalledWith('+5511999999999')
  })
})
