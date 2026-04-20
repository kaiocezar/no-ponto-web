import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useValidateInvite, useAcceptInvite } from '@features/staff/hooks/useAcceptInvite'

const acceptSchema = z.object({
  full_name: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
})

type AcceptFormValues = z.infer<typeof acceptSchema>

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [accepted, setAccepted] = useState(false)

  const { data: inviteData, isLoading, isError } = useValidateInvite(token)
  const acceptMutation = useAcceptInvite()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptFormValues>({
    resolver: zodResolver(acceptSchema),
    defaultValues: { full_name: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await acceptMutation.mutateAsync({
        token,
        full_name: values.full_name || undefined,
        password: values.password || undefined,
      })
      setAccepted(true)
      toast.success('Convite aceito! Bem-vindo à equipe.')
    } catch {
      toast.error('Erro ao aceitar convite. Verifique se o link ainda é válido.')
    }
  })

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-gray-600">Link de convite inválido.</p>
        <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
          Ir para o início
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="mt-4 text-gray-500">Validando convite…</p>
      </div>
    )
  }

  if (isError || !inviteData) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center" role="alert">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">Convite inválido ou expirado</h1>
          <p className="mt-2 text-sm text-red-600">
            Este link de convite não é válido ou já expirou. Peça ao administrador para reenviar o
            convite.
          </p>
        </div>
        <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
          Ir para o início
        </Link>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-4 text-xl font-bold text-green-800">Bem-vindo à equipe!</h1>
          <p className="mt-2 text-sm text-green-600">
            Você agora faz parte da equipe de{' '}
            <strong>{inviteData.provider_name}</strong>.
          </p>
          <Link
            to="/entrar"
            className="mt-6 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Aceitar convite</h1>
        <p className="mt-2 text-sm text-gray-600">
          Você foi convidado por <strong>{inviteData.provider_name}</strong> para integrar a equipe
          como <strong>{inviteData.staff_name}</strong>.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
          onSubmit={(e) => { void onSubmit(e) }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Seu nome (opcional — deixe em branco para manter o atual)"
            placeholder={inviteData.staff_name}
            {...register('full_name')}
            error={errors.full_name?.message}
          />
          <Input
            label="Senha (obrigatória se for um novo usuário)"
            type="password"
            placeholder="Mínimo 8 caracteres"
            {...register('password')}
            error={errors.password?.message}
          />

          <p className="text-[11px] text-slate-400">
            Se você já possui uma conta, faça login e o vínculo será criado automaticamente. A senha
            acima só é necessária se for criar uma conta nova.
          </p>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Aceitar convite
          </Button>
        </form>
      </div>
    </div>
  )
}
