import { api } from '@lib/api'

import type { MyAppointment, MyAppointmentsFilterStatus, PaginatedResponse } from '@/types/api'

export const myAppointmentsApi = {
  list(status: MyAppointmentsFilterStatus, cursor?: string) {
    return api
      .get<PaginatedResponse<MyAppointment>>('/accounts/me/appointments/', {
        params: {
          status,
          page_cursor: cursor,
        },
      })
      .then((r) => r.data)
  },
}
