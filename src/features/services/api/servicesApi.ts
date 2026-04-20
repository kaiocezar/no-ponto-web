import api from '@lib/api'
import type { Service } from '@/types/api'

export const servicesApi = {
  list: () => api.get<Service[]>('/providers/me/services/').then((r) => r.data),
  create: (data: Partial<Service> & { staff_ids?: string[] }) =>
    api.post<Service>('/providers/me/services/', data).then((r) => r.data),
  update: (id: string, data: Partial<Service> & { staff_ids?: string[] }) =>
    api.patch<Service>(`/providers/me/services/${id}/`, data).then((r) => r.data),
  activate: (id: string) =>
    api.post<Service>(`/providers/me/services/${id}/activate/`).then((r) => r.data),
  deactivate: (id: string) =>
    api.post<Service>(`/providers/me/services/${id}/deactivate/`).then((r) => r.data),
  delete: async (id: string): Promise<void> => {
    await api.delete(`/providers/me/services/${id}/`)
  },
  publicList: (slug: string) =>
    api.get<Service[]>(`/providers/${slug}/services/`).then((r) => r.data),
}
