import { api } from '@lib/api'

import type { ProviderDashboardResponse } from '@/types/api'

export const dashboardApi = {
  get(date?: string) {
    return api
      .get<ProviderDashboardResponse>('/providers/me/dashboard/', {
        params: date ? { date } : undefined,
      })
      .then((r) => r.data)
  },
}
