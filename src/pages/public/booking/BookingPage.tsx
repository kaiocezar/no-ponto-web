import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ClientAuthFlow } from '@features/auth'
import { usePublicProfile } from '@features/providers/hooks/usePublicProfile'
import { useAvailableSlots } from '@features/scheduling/hooks/useAvailableSlots'
import { useCreateAppointment } from '@features/scheduling/hooks/useAppointments'
import { useAuthStore } from '@store/authStore'
import type { AvailableSlot } from '@/types/api'

type Step = 'date' | 'slot' | 'form' | 'submitting' | 'success' | 'error'

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function todayInputMin(): string {
  const d = new Date()
  const y = String(d.getFullYear())
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSlotLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const serviceId = searchParams.get('service_id') ?? ''

  const { data: profile, isLoading, error } = usePublicProfile(slug ?? '')
  const createMutation = useCreateAppointment()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [clientPhone, setClientPhone] = useState<string | null>(null)
  const [clientNameOverride, setClientNameOverride] = useState<string | null>(null)
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [slotMessage, setSlotMessage] = useState<string | null>(null)
  const [genericError, setGenericError] = useState<string | null>(null)

  const service = useMemo(
    () => profile?.services?.find((s) => s.id === serviceId),
    [profile, serviceId],
  )

  const availability = useAvailableSlots({
    slug: slug ?? '',
    serviceId,
    date: selectedDate,
    enabled: step === 'slot',
  })

  const slots = availability.data ?? []
  const slotsLoading = availability.isFetching

  const goBack = useCallback(() => {
    setGenericError(null)
    setSlotMessage(null)
    if (step === 'slot') {
      setStep('date')
      setSelectedSlot(null)
    } else if (step === 'form') {
      setStep('slot')
    } else if (step === 'error') {
      setStep('form')
    }
  }, [step])

  const handleDateContinue = () => {
    if (!selectedDate) return
    setSlotMessage(null)
    setStep('slot')
  }

  useEffect(() => {
    if (step !== 'slot' || !selectedDate || slotsLoading) return
    if (availability.isSuccess && slots.length === 0) {
      setSlotMessage('Nenhum horário disponível nesta data. Escolha outra data.')
      setStep('date')
    }
  }, [step, selectedDate, slotsLoading, availability.isSuccess, slots.length])

  const validateForm = (): boolean => {
    const e: Record<string, string> = {}
    if (!isValidEmail(clientEmail)) e.clientEmail = 'E-mail inválido'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!profile || !service || !selectedSlot) return
    if (!validateForm()) return
    const resolvedName = clientNameOverride ?? user?.full_name ?? 'Cliente'
    const resolvedPhone = clientPhone ?? user?.phone_number ?? ''
    if (!isValidPhone(resolvedPhone)) {
      setFormErrors({ clientPhone: 'Telefone de autenticacao invalido. Refaça o login.' })
      return
    }
    setStep('submitting')
    setGenericError(null)
    try {
      const res = await createMutation.mutateAsync({
        provider_slug: profile.slug,
        service_id: service.id,
        start_datetime: selectedSlot.start,
        client_name: resolvedName,
        client_phone: resolvedPhone,
        client_email: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      sessionStorage.setItem(`bookingPhone:${res.public_id}`, resolvedPhone)
      void navigate(`/${profile.slug}/agendamento/${res.public_id}`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const payload = err.response.data as { error?: { code?: string } }
        const code = payload.error?.code
        if (code === 'slot_not_available' || code === 'SLOT_NOT_AVAILABLE') {
          setSlotMessage('Este horário acabou de ser reservado. Escolha outro horário.')
          setSelectedSlot(null)
          setStep('slot')
          return
        }
      }
      setGenericError('Erro ao realizar agendamento. Tente novamente.')
      setStep('error')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">Carregando…</div>
    )
  }

  if (error || !profile) {
    const is404 = axios.isAxiosError(error) && error.response?.status === 404
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          {is404 ? 'Prestador não encontrado' : 'Erro ao carregar'}
        </h1>
        <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
          Voltar ao início
        </Link>
      </div>
    )
  }

  if (!serviceId || !service) {
    const backSlug = profile.slug
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-600">Serviço inválido ou não informado.</p>
        <Link to={`/${backSlug}`} className="mt-4 inline-block text-primary-600 hover:underline">
          Voltar ao perfil
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6">
        <Link to={`/${profile.slug}`} className="text-sm text-primary-600 hover:underline">
          ← Voltar ao perfil
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Agendar</h1>
        <p className="text-sm text-gray-600">{service.name}</p>
      </div>

      {!isAuthenticated && (
        <ClientAuthFlow
          onAuthenticated={({ phone, fullName }) => {
            setClientPhone(phone)
            setClientNameOverride(fullName ?? null)
          }}
        />
      )}

      {isAuthenticated && step === 'date' && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Telefone confirmado. Agora escolha data e horario para continuar.
        </p>
      )}

      {isAuthenticated && step === 'date' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Escolha a data</label>
          <input
            type="date"
            min={todayInputMin()}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value)
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          {slotMessage && <p className="text-sm text-amber-700">{slotMessage}</p>}
          <Button type="button" onClick={handleDateContinue} disabled={!selectedDate}>
            Continuar
          </Button>
        </div>
      )}

      {isAuthenticated && step === 'slot' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Data:{' '}
            <strong>
              {selectedDate
                ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')
                : ''}
            </strong>
          </p>
          {slotsLoading && <p className="text-sm text-gray-500">Carregando horários…</p>}
          {!slotsLoading && slots.length === 0 && (
            <p className="text-sm text-amber-700">Nenhum horário disponível nesta data.</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <Button
                key={slot.start}
                type="button"
                variant={selectedSlot?.start === slot.start ? 'primary' : 'secondary'}
                onClick={() => {
                  setSelectedSlot(slot)
                }}
              >
                {formatSlotLabel(slot.start)}
              </Button>
            ))}
          </div>
          {slotMessage && (
            <p className="text-sm text-red-600" role="alert">
              {slotMessage}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={goBack}>
              Voltar
            </Button>
            <Button
              type="button"
              disabled={!selectedSlot}
              onClick={() => {
                setSlotMessage(null)
                setStep('form')
              }}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {isAuthenticated && step === 'form' && (
        <div className="space-y-4">
          <Input
            label="E-mail (opcional)"
            type="email"
            value={clientEmail}
            onChange={(e) => {
              setClientEmail(e.target.value)
            }}
            error={formErrors.clientEmail}
          />
          {formErrors.clientPhone && <p className="text-sm text-red-600">{formErrors.clientPhone}</p>}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
              }}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={goBack}>
              Voltar
            </Button>
            <Button
              type="button"
              onClick={() => {
                void handleSubmit()
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}

      {isAuthenticated && step === 'submitting' && (
        <div className="py-12 text-center text-gray-600">Enviando agendamento…</div>
      )}

      {isAuthenticated && step === 'error' && (
        <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{genericError}</p>
          <Button
            type="button"
            onClick={() => {
              setStep('form')
            }}
          >
            Tentar novamente
          </Button>
        </div>
      )}

    </div>
  )
}
