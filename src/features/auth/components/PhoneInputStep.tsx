import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PhoneInputStepProps {
  isPending: boolean
  onSubmit: (phoneE164: string) => void
}

function toDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 13)
}

function formatPhoneMask(value: string): string {
  const digits = toDigits(value)
  const ddd = digits.slice(2, 4)
  const prefix = digits.slice(4, 9)
  const suffix = digits.slice(9, 13)

  if (digits.length <= 2) return `+${digits}`
  if (digits.length <= 4) return `+${digits.slice(0, 2)} ${ddd}`
  if (digits.length <= 9) return `+${digits.slice(0, 2)} ${ddd} ${prefix}`
  return `+${digits.slice(0, 2)} ${ddd} ${prefix}-${suffix}`
}

function toE164(value: string): string {
  const digits = toDigits(value)
  if (!digits.startsWith('55')) {
    return `+55${digits}`
  }
  return `+${digits}`
}

function isValidBrazilPhone(value: string): boolean {
  const normalized = toE164(value).replace(/\D/g, '')
  return normalized.length === 13
}

export function PhoneInputStep({ isPending, onSubmit }: PhoneInputStepProps) {
  const [phone, setPhone] = useState('+55 ')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!isValidBrazilPhone(phone)) {
      setError('Informe um telefone válido no formato +55 XX XXXXX-XXXX.')
      return
    }

    setError(null)
    onSubmit(toE164(phone))
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Identifique-se para continuar</h2>
      <p className="text-sm text-slate-600">
        Enviaremos um código por WhatsApp para confirmar seu telefone.
      </p>

      <Input
        label="Telefone"
        value={phone}
        onChange={(event) => {
          setPhone(formatPhoneMask(event.target.value))
        }}
        placeholder="+55 11 99999-9999"
        error={error ?? undefined}
      />

      <Button type="button" onClick={handleSubmit} isLoading={isPending} className="w-full">
        Receber código
      </Button>
    </div>
  )
}
