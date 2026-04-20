import api from '@lib/api'
import type { Staff, InviteData } from '@/types/api'

export const staffApi = {
  list: () => api.get<Staff[]>('/providers/me/staff/').then((r) => r.data),
  invite: (data: { name: string; invite_email: string; role: string }) =>
    api.post<Staff>('/providers/me/staff/', data).then((r) => r.data),
  update: (id: string, data: Partial<Staff>) =>
    api.patch<Staff>(`/providers/me/staff/${id}/`, data).then((r) => r.data),
  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/providers/me/staff/${id}/`)
  },
  resendInvite: async (id: string): Promise<void> => {
    await api.post(`/providers/me/staff/${id}/resend-invite/`)
  },
  validateInvite: (token: string) =>
    api.get<InviteData>(`/accounts/accept-invite/?token=${token}`).then((r) => r.data),
  acceptInvite: async (data: { token: string; full_name?: string; password?: string }): Promise<void> => {
    await api.post('/accounts/accept-invite/accept/', data)
  },
  publicList: (slug: string, serviceId?: string) => {
    const params = serviceId ? `?service_id=${serviceId}` : ''
    return api.get<Staff[]>(`/providers/${slug}/staff/${params}`).then((r) => r.data)
  },
}
