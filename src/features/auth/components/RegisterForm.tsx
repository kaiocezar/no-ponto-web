import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Alert } from '@components/ui/Alert'
import { useRegister } from '../hooks/useRegister'

const schema = z
  .object({
    full_name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    mutate({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4" noValidate>
      <Input
        label="Nome completo"
        type="text"
        placeholder="Seu nome"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

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
        placeholder="Mínimo 8 caracteres"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Repita a senha"
        error={errors.confirm_password?.message}
        {...register('confirm_password')}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" isLoading={isPending} className="w-full mt-2">
        Criar conta
      </Button>

      <p className="text-center text-sm text-gray-600">
        Já tem conta?{' '}
        <Link to="/login" className="text-primary-600 hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </form>
  )
}
