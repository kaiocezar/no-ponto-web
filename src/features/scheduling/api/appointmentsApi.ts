import api from '@lib/api'
import type {
  AppointmentLookup,
  AppointmentPublicBookingResponse,
  CancelAppointmentPayload,
  CreateAppointmentPayload,
  RescheduleAppointmentPayload,
  RescheduleOption,
  RescheduleOptionsResponse,
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

  cancelByCode: async (payload: CancelAppointmentPayload): Promise<void> => {
    await api.post('/appointments/cancel-by-code/', payload)
  },

  getRescheduleOptions: async (appointmentId: string, phone: string): Promise<RescheduleOption[]> => {
    const { data } = await api.get<RescheduleOptionsResponse>(
      `/appointments/${appointmentId}/reschedule-options/`,
      {
        params: { phone },
      },
    )
    return data.slots
  },

  rescheduleAppointment: async (
    appointmentId: string,
    payload: RescheduleAppointmentPayload,
  ): Promise<AppointmentLookup> => {
    const { data } = await api.post<AppointmentLookup>(
      `/appointments/${appointmentId}/reschedule/`,
      payload,
    )
    return data
  },
}
