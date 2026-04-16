import api from '@lib/api'
import type {
  AppointmentLookup,
  AppointmentPublicBookingResponse,
  CreateAppointmentPayload,
} from '@/types/api'

export const appointmentsApi = {
  createAppointment: async (
    payload: CreateAppointmentPayload,
  ): Promise<AppointmentPublicBookingResponse> => {
    const { data } = await api.post<AppointmentPublicBookingResponse>('/appointments/', payload)
    return data
  },

  lookupAppointment: async (publicId: string, phone: string): Promise<AppointmentLookup> => {
    const { data } = await api.get<AppointmentLookup>('/appointments/lookup/', {
      params: { public_id: publicId, phone },
    })
    return data
  },
}
