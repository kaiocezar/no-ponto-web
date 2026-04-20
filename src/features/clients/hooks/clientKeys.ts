import type { ClientAppointmentsFilters } from '../api/clientsApi'

export const clientKeys = {
  all: ['provider-clients'] as const,
  list: (search?: string) => [...clientKeys.all, 'list', search ?? ''] as const,
  appointments: (phone: string, filters: ClientAppointmentsFilters) =>
    [...clientKeys.all, 'appointments', phone, filters] as const,
  notes: (phone: string) => [...clientKeys.all, 'notes', phone] as const,
}
