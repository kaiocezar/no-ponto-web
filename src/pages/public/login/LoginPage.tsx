import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Alert } from '@components/ui/Alert'
import { useLogin } from '@features/auth/hooks/useLogin'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

type ActiveTab = 'login' | 'register'

const bullets = [
  'Agenda inteligente sem conflitos de horário',
  'Lembretes automáticos via WhatsApp',
  'Confirmações e cancelamentos em um clique',
  'Relatórios de presença e receita mensais',
]

function LogoIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function LoginForm() {
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormData) => {
    mutate(data)
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      className="flex flex-col gap-4"
      noValidate
    >
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

      <Button type="submit" isLoading={isPending} className="mt-1 w-full">
        Entrar
      </Button>
    </form>
  )
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login')

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — visível apenas em desktop */}
      <div
        className="hidden flex-1 flex-col justify-between p-12 lg:flex"
        style={{ background: 'linear-gradient(145deg, #052e16, #15803d)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <LogoIcon />
          </div>
          <span className="text-[20px] font-bold tracking-tight text-white">
            NoPonto
          </span>
        </div>

        {/* Conteúdo central */}
        <div className="max-w-sm">
          <h1 className="text-[32px] font-bold leading-tight text-white">
            A agenda que respeita o seu tempo — e o do paciente.
          </h1>
          <p
            className="mt-4 text-[15px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,.65)' }}
          >
            Gerencie consultas, reduza faltas e automatize lembretes direto no
            WhatsApp.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                  <CheckIcon />
                </div>
                <span className="text-[14px] text-white/80">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé esquerdo */}
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,.35)' }}>
          © 2026 NoPonto. Todos os direitos reservados.
        </p>
      </div>

      {/* Painel direito */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-[480px] lg:flex-shrink-0">
        {/* Logo mobile */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">
            NoPonto
          </span>
        </div>

        <div className="w-full max-w-[360px]">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('login') }}
              className={[
                'flex-1 rounded-md py-2 text-[13px] font-semibold transition-all',
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register') }}
              className={[
                'flex-1 rounded-md py-2 text-[13px] font-semibold transition-all',
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Criar conta
            </button>
          </div>

          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <p className="text-[14px] text-slate-600">
                Para criar sua conta, acesse a página de cadastro completo.
              </p>
              <Link to="/cadastro">
                <Button variant="primary" className="w-full">
                  Ir para o cadastro
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
