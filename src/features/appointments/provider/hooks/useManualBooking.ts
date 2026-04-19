import { useMutation, useQueryClient } from '@tanstack/react-query'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'
import { providerAppointmentKeys } from './providerAppointmentKeys'

import type { ProviderManualBookingPayload } from '@/types/api'

export function useManualBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProviderManualBookingPayload) => providerAppointmentsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerAppointmentKeys.all })
    },
  })
}
