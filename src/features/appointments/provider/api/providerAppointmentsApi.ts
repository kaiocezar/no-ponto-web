import { api } from '@lib/api'

import type {
  ProviderAppointmentDetail,
  ProviderAppointmentListRow,
  ProviderManualBookingPayload,
} from '@/types/api'

const path = '/providers/me/appointments'

export interface ProviderAppointmentListParams {
  date_from?: string
  date_to?: string
  status?: string
  staff_id?: string
}

export const providerAppointmentsApi = {
  list(params: ProviderAppointmentListParams) {
    return api.get<ProviderAppointmentListRow[]>(path, { params }).then((r) => r.data)
  },

  create(payload: ProviderManualBookingPayload) {
    return api.post<ProviderAppointmentDetail>(path, payload).then((r) => r.data)
  },

  get(id: string) {
    return api.get<ProviderAppointmentDetail>(`${path}/${id}/`).then((r) => r.data)
  },

  patch(id: string, body: { internal_notes: string }) {
    return api.patch<ProviderAppointmentDetail>(`${path}/${id}/`, body).then((r) => r.data)
  },

  confirm(id: string) {
    return api.post<ProviderAppointmentDetail>(`${path}/${id}/confirm/`).then((r) => r.data)
  },

  complete(id: string) {
    return api.post<ProviderAppointmentDetail>(`${path}/${id}/complete/`).then((r) => r.data)
  },

  noShow(id: string) {
    return api.post<ProviderAppointmentDetail>(`${path}/${id}/no-show/`).then((r) => r.data)
  },

  cancel(id: string, body?: { reason?: string | null }) {
    return api.post<ProviderAppointmentDetail>(`${path}/${id}/cancel/`, body ?? {}).then((r) => r.data)
  },
}
