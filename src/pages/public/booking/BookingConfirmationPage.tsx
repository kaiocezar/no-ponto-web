import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppointmentLookup } from '@features/scheduling/hooks/useAppointments'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

export default function BookingConfirmationPage() {
  const { slug, publicId } = useParams<{ slug: string; publicId: string }>()
  const [phoneDraft, setPhoneDraft] = useState('')
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!publicId) {
      setHydrated(true)
      return
    }
    setSubmittedPhone(sessionStorage.getItem(`bookingPhone:${publicId}`))
    setPhoneDraft('')
    setHydrated(true)
  }, [publicId])

  const activePhone = submittedPhone ?? ''
  const { data, isLoading, isError, error } = useAppointmentLookup(publicId, activePhone || undefined)

  const is404 = axios.isAxiosError(error) && error.response?.status === 404

  const handlePhoneSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const trimmed = phoneDraft.trim()
    if (!trimmed || !publicId) return
    sessionStorage.setItem(`bookingPhone:${publicId}`, trimmed)
    setSubmittedPhone(trimmed)
  }

  if (!slug || !publicId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-600">URL inválida.</div>
    )
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">Carregando…</div>
    )
  }

  if (submittedPhone === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-xl font-bold text-gray-900">Consultar agendamento</h1>
        <p className="mt-2 text-sm text-gray-600">
          Informe o telefone usado na reserva para ver os detalhes.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handlePhoneSubmit}>
          <Input
            label="Telefone"
            value={phoneDraft}
            onChange={(e) => {
              setPhoneDraft(e.target.value)
            }}
            placeholder="+55 11 99999-9999"
          />
          <Button type="submit">Consultar</Button>
        </form>
        <Link to={`/${slug}`} className="mt-6 inline-block text-sm text-primary-600 hover:underline">
          Voltar ao perfil
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">Carregando…</div>
    )
  }

  if (isError || !data || is404) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Agendamento não encontrado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Verifique o código e o telefone, ou entre em contato com o prestador.
        </p>
        <Link
          to={`/${slug}`}
          className="mt-6 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Voltar ao perfil
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Agendamento confirmado</h1>
      <p className="mt-1 text-sm text-gray-500">Código: {data.public_id}</p>

      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-gray-500">Serviço</dt>
          <dd className="text-gray-900">{data.service.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Data e hora</dt>
          <dd className="text-gray-900">{formatDateTime(data.start_datetime)}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Prestador</dt>
          <dd className="text-gray-900">{data.provider.business_name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Cliente</dt>
          <dd className="text-gray-900">{data.client_name}</dd>
        </div>
      </dl>

      <p className="mt-8 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-900">
        Em breve você receberá uma confirmação.
      </p>

      <Link to={`/${slug}`} className="mt-8 inline-block text-sm text-primary-600 hover:underline">
        Voltar ao perfil
      </Link>
    </div>
  )
}
