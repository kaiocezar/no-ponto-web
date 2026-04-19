import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@store/authStore'

export function OptionalDataPrompt() {
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((s) => s.setUser)

  const updateMeMutation = useMutation({
    mutationFn: () =>
      authApi.updateMe({
        email: email.trim() || undefined,
        birth_date: birthDate || undefined,
      }),
    onSuccess: (user) => {
      setUser(user)
      setDismissed(true)
    },
    onError: () => {
      setError('Nao foi possivel salvar agora. Tente novamente em instantes.')
    },
  })

  if (dismissed) return null

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Complete seu perfil (opcional)</h2>
      <p className="mt-1 text-sm text-slate-600">
        Adicione e-mail e data de nascimento para receber comunicacoes e lembretes personalizados.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError(null)
          }}
          placeholder="voce@email.com"
        />
        <Input
          label="Data de nascimento"
          type="date"
          value={birthDate}
          onChange={(event) => {
            setBirthDate(event.target.value)
            setError(null)
          }}
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setDismissed(true)
          }}
        >
          Talvez depois
        </Button>
        <Button
          type="button"
          isLoading={updateMeMutation.isPending}
          onClick={() => {
            updateMeMutation.mutate()
          }}
        >
          Salvar dados
        </Button>
      </div>
    </div>
  )
}
