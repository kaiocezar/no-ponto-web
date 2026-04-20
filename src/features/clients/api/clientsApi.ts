import { api } from '@lib/api'
import type {
  ClientNote,
  CreateClientNotePayload,
  PaginatedResponse,
  ProviderClient,
  ProviderClientAppointment,
} from '@/types/api'

export interface ClientAppointmentsFilters {
  status?: string
  date_from?: string
  date_to?: string
  page_cursor?: string
}

export const clientsApi = {
  list(search?: string) {
    return api
      .get<ProviderClient[]>('/providers/me/clients/', {
        params: search ? { search } : undefined,
      })
      .then((r) => r.data)
  },

  appointments(phone: string, filters: ClientAppointmentsFilters) {
    return api
      .get<PaginatedResponse<ProviderClientAppointment>>(
        `/providers/me/clients/${encodeURIComponent(phone)}/appointments/`,
        { params: filters },
      )
      .then((r) => r.data)
  },

  listNotes(phone: string) {
    return api
      .get<ClientNote[]>(`/providers/me/clients/${encodeURIComponent(phone)}/notes/`)
      .then((r) => r.data)
  },

  createNote(phone: string, payload: CreateClientNotePayload) {
    return api
      .post<ClientNote>(`/providers/me/clients/${encodeURIComponent(phone)}/notes/`, payload)
      .then((r) => r.data)
  },
}
