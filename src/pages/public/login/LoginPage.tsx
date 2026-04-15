import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Alert } from '@components/ui/Alert'
import { useLogin } from '@features/auth/hooks/useLogin'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Entrar no Agendador</h1>
          <p className="mt-2 text-sm text-gray-600">Acesse seu painel de agendamentos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              error={errors.password?.message}
              {...register('password')}
            />

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" isLoading={isPending} className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-primary-600 hover:underline font-medium">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
