import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { OTPVerificationStep } from './OTPVerificationStep'

describe('OTPVerificationStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('submete quando os 6 digitos sao preenchidos', () => {
    const onSubmit = vi.fn()
    render(
      <OTPVerificationStep
        phone="+5511999999999"
        isPending={false}
        onSubmit={onSubmit}
        onResend={vi.fn()}
      />,
    )

    for (let i = 1; i <= 6; i += 1) {
      fireEvent.change(screen.getByLabelText(`Digito ${String(i)} do codigo`), {
        target: { value: String(i) },
      })
    }

    fireEvent.click(screen.getByRole('button', { name: 'Verificar código' }))
    expect(onSubmit).toHaveBeenCalledWith('123456')
  })

  it('mostra erro quando codigo incompleto', () => {
    render(
      <OTPVerificationStep
        phone="+5511999999999"
        isPending={false}
        onSubmit={vi.fn()}
        onResend={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Digito 1 do codigo'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Verificar código' }))

    expect(screen.getByText('Digite os 6 dígitos recebidos no WhatsApp.')).toBeInTheDocument()
  })

  it('inicia contador e desabilita reenvio enquanto aguarda', () => {
    render(
      <OTPVerificationStep
        phone="+5511999999999"
        isPending={false}
        onSubmit={vi.fn()}
        onResend={vi.fn()}
      />,
    )

    const resendButton = screen.getByRole('button', { name: 'Reenviar código' })
    expect(resendButton).toBeDisabled()
    expect(screen.getByText('Reenvio em 60s')).toBeInTheDocument()
  })
})
