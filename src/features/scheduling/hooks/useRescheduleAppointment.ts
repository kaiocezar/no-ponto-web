import { useMutation } from '@tanstack/react-query'

import { appointmentsApi } from '../api/appointmentsApi'
import type { RescheduleAppointmentPayload } from '@/types/api'

interface UseRescheduleAppointmentPayload {
  appointmentId: string
  payload: RescheduleAppointmentPayload
}

export function useRescheduleAppointment() {
  return useMutation({
    mutationFn: ({ appointmentId, payload }: UseRescheduleAppointmentPayload) =>
      appointmentsApi.rescheduleAppointment(appointmentId, payload),
  })
}
