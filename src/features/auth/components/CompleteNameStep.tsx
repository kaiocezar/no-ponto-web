import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CompleteNameStepProps {
  isPending: boolean
  onSubmit: (fullName: string) => void
}

export function CompleteNameStep({ isPending, onSubmit }: CompleteNameStepProps) {
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (fullName.trim().length < 2) {
      setError('Informe seu nome completo para finalizar.')
      return
    }

    setError(null)
    onSubmit(fullName.trim())
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Complete seu cadastro</h2>
      <p className="text-sm text-slate-600">
        É rápido: precisamos do seu nome para concluir o primeiro agendamento.
      </p>

      <Input
        label="Nome completo"
        value={fullName}
        onChange={(event) => {
          setFullName(event.target.value)
        }}
        placeholder="Ex.: Maria Silva"
        error={error ?? undefined}
      />

      <Button type="button" onClick={handleSubmit} isLoading={isPending} className="w-full">
        Continuar
      </Button>
    </div>
  )
}
