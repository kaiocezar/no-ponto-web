export const providerAppointmentKeys = {
  all: ['provider-appointments'] as const,
  list: (dateFrom: string, dateTo: string, status?: string) =>
    [...providerAppointmentKeys.all, 'list', dateFrom, dateTo, status ?? ''] as const,
  detail: (id: string) => [...providerAppointmentKeys.all, 'detail', id] as const,
}
