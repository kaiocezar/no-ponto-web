import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'

interface OTPVerificationStepProps {
  phone: string
  isPending: boolean
  onSubmit: (code: string) => void
  onResend: () => void
}

const OTP_SIZE = 6
const RESEND_SECONDS = 60

export function OTPVerificationStep({
  phone,
  isPending,
  onSubmit,
  onResend,
}: OTPVerificationStepProps) {
  const [digits, setDigits] = useState<string[]>(Array.from({ length: OTP_SIZE }, () => ''))
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [error, setError] = useState<string | null>(null)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (countdown <= 0) return
    const timeoutId = window.setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [countdown])

  const codeValue = useMemo(() => digits.join(''), [digits])

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = clean
    setDigits(next)
    setError(null)

    if (clean && index < OTP_SIZE - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (index: number, value: string) => {
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    if (codeValue.length !== OTP_SIZE) {
      setError('Digite os 6 dígitos recebidos no WhatsApp.')
      return
    }
    onSubmit(codeValue)
  }

  const handleResend = () => {
    if (countdown > 0) return
    setCountdown(RESEND_SECONDS)
    setDigits(Array.from({ length: OTP_SIZE }, () => ''))
    setError(null)
    onResend()
    inputsRef.current[0]?.focus()
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Confirme o código</h2>
      <p className="text-sm text-slate-600">Digite o código de 6 dígitos enviado para {phone}.</p>

      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={`otp-${String(index)}`}
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            value={digit}
            onChange={(event) => {
              handleChange(index, event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace') {
                handleBackspace(index, digit)
              }
            }}
            inputMode="numeric"
            maxLength={1}
            className="h-12 w-12 rounded-lg border border-slate-300 text-center text-lg font-semibold focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
            aria-label={`Digito ${String(index + 1)} do codigo`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium text-primary-700 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={countdown > 0}
          onClick={handleResend}
        >
          Reenviar código
        </button>
        <span className="text-sm text-slate-500">
          {countdown > 0 ? `Reenvio em ${String(countdown)}s` : 'Pode reenviar agora'}
        </span>
      </div>

      <Button type="button" onClick={handleSubmit} isLoading={isPending} className="w-full">
        Verificar código
      </Button>
    </div>
  )
}
