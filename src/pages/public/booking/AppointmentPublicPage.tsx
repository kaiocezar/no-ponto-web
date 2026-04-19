import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { AppointmentDetail } from '@features/scheduling/components/AppointmentDetail'
import { AppointmentLookupForm } from '@features/scheduling/components/AppointmentLookupForm'
import { CancelConfirmModal } from '@features/scheduling/components/CancelConfirmModal'
import { RescheduleFlow } from '@features/scheduling/components/RescheduleFlow'
import {
  useCancelAppointment,
  useLookupAppointment,
} from '@features/scheduling/hooks/useAppointments'

interface ApiErrorResponse {
  code?: string
}

function getLookupErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
    return 'Não foi possível consultar o agendamento. Verifique os dados informados.'
  }
  return 'Erro ao consultar agendamento. Tente novamente em instantes.'
}

function getCancelErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const code = error.response?.data.code
    if (code === 'appointment_in_past') {
      return 'Este agendamento já aconteceu e não pode mais ser cancelado.'
    }
    if (code === 'cancellation_window_closed') {
      return 'O prazo mínimo para cancelamento foi encerrado.'
    }
  }
  return 'Não foi possível cancelar agora. Verifique os dados e tente novamente.'
}

export default function AppointmentPublicPage() {
  const { publicId } = useParams<{ publicId: string }>()
  const [phone, setPhone] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  const lookupQuery = useLookupAppointment(publicId, phone ?? undefined)
  const cancelMutation = useCancelAppointment()

  const handleLookup = (value: string) => {
    setPhone(value)
    setIsCancelled(false)
    setShowCancelModal(false)
    cancelMutation.reset()
  }

  const handleOpenCancelModal = () => {
    cancelMutation.reset()
    setShowCancelModal(true)
  }

  const handleConfirmCancel = (reason?: string) => {
    if (!publicId || !phone) return
    cancelMutation.mutate({
      public_id: publicId,
      phone,
      reason,
    }, {
      onSuccess: () => {
        setShowCancelModal(false)
        setIsCancelled(true)
      },
    })
  }

  if (!publicId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-slate-600">Link inválido.</div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Consultar agendamento</h1>
        <p className="mt-1 text-sm text-slate-600">
          Informe o telefone usado na reserva para visualizar os detalhes.
        </p>
      </div>

      <AppointmentLookupForm isLoading={lookupQuery.isFetching} onSubmit={handleLookup} />

      {lookupQuery.isError && <Alert variant="error">{getLookupErrorMessage(lookupQuery.error)}</Alert>}

      {lookupQuery.data && (
        <AppointmentDetail
          appointment={lookupQuery.data}
          onCancel={lookupQuery.data.can_cancel ? handleOpenCancelModal : undefined}
        />
      )}

      {isCancelled && (
        <Alert variant="success">
          Agendamento cancelado com sucesso. Agora escolha um novo horário para reagendar.
        </Alert>
      )}

      {cancelMutation.isError && !showCancelModal && (
        <Alert variant="error">
          {getCancelErrorMessage(cancelMutation.error)}
        </Alert>
      )}

      {isCancelled && (
        lookupQuery.data && phone && (
          <RescheduleFlow
            appointmentId={lookupQuery.data.id}
            phone={phone}
          />
        )
      )}

      {showCancelModal && lookupQuery.data && (
        <CancelConfirmModal
          appointment={lookupQuery.data}
          isLoading={cancelMutation.isPending}
          errorMessage={cancelMutation.isError ? getCancelErrorMessage(cancelMutation.error) : null}
          onClose={() => {
            if (cancelMutation.isPending) return
            setShowCancelModal(false)
          }}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  )
}
