import { useMutation, useQuery } from '@tanstack/react-query'

import { appointmentsApi } from '../api/appointmentsApi'
import type { CancelAppointmentPayload, CreateAppointmentPayload } from '@/types/api'

const appointmentKeys = {
  lookup: (publicId: string, phone: string) => ['appointments', 'lookup', publicId, phone] as const,
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.createAppointment(payload),
  })
}

export function useAppointmentLookup(publicId: string | undefined, phone: string | undefined) {
  return useQuery({
    queryKey: appointmentKeys.lookup(publicId ?? '', phone ?? ''),
    queryFn: () => {
      if (!publicId || !phone) {
        throw new Error('publicId e phone são obrigatórios para lookup.')
      }
      return appointmentsApi.lookupAppointment(publicId, phone)
    },
    enabled: Boolean(publicId && phone),
    staleTime: 1000 * 60,
    retry: false,
  })
}

export function useLookupAppointment(publicId: string | undefined, phone: string | undefined) {
  return useAppointmentLookup(publicId, phone)
}

export function useCancelAppointment() {
  return useMutation({
    mutationFn: (payload: CancelAppointmentPayload) => appointmentsApi.cancelByCode(payload),
  })
}
