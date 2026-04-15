import api from '@lib/api'
import type { CreateServicePayload, ProviderProfile, Service, ServiceCategory } from '@/types/api'

export const providersApi = {
  /**
   * Retorna o perfil do prestador autenticado.
   * GET /providers/me/
   */
  getMyProfile: async (): Promise<ProviderProfile> => {
    const { data } = await api.get<ProviderProfile>('/providers/me/')
    return data
  },

  /**
   * Atualiza parcialmente o perfil do prestador autenticado.
   * PATCH /providers/me/
   */
  updateMyProfile: async (payload: Partial<ProviderProfile>): Promise<ProviderProfile> => {
    const { data } = await api.patch<ProviderProfile>('/providers/me/', payload)
    return data
  },

  /**
   * Publica o perfil do prestador.
   * POST /providers/me/publish/
   */
  publishProfile: async (): Promise<ProviderProfile> => {
    const { data } = await api.post<ProviderProfile>('/providers/me/publish/')
    return data
  },

  /**
   * Despublica o perfil do prestador.
   * POST /providers/me/unpublish/
   */
  unpublishProfile: async (): Promise<ProviderProfile> => {
    const { data } = await api.post<ProviderProfile>('/providers/me/unpublish/')
    return data
  },

  /**
   * Retorna o perfil público de um prestador pelo slug.
   * GET /providers/{slug}/
   */
  getPublicProfile: async (slug: string): Promise<ProviderProfile> => {
    const { data } = await api.get<ProviderProfile>(`/providers/${slug}/`)
    return data
  },

  /**
   * Lista todas as categorias de serviço.
   * GET /categories/
   */
  getCategories: async (): Promise<ServiceCategory[]> => {
    const { data } = await api.get<ServiceCategory[]>('/categories/')
    return data
  },

  // ── Serviços do prestador autenticado ─────────────────────────────────────

  /**
   * Lista os serviços do prestador autenticado.
   * GET /providers/me/services/
   */
  listMyServices: async (): Promise<Service[]> => {
    const { data } = await api.get<Service[]>('/providers/me/services/')
    return data
  },

  /**
   * Cria um novo serviço para o prestador autenticado.
   * POST /providers/me/services/
   */
  createService: async (payload: CreateServicePayload): Promise<Service> => {
    const { data } = await api.post<Service>('/providers/me/services/', payload)
    return data
  },

  /**
   * Atualiza parcialmente um serviço do prestador autenticado.
   * PATCH /providers/me/services/{id}/
   */
  updateService: async (id: string, payload: Partial<CreateServicePayload>): Promise<Service> => {
    const { data } = await api.patch<Service>(`/providers/me/services/${id}/`, payload)
    return data
  },

  /**
   * Remove (soft delete) um serviço do prestador autenticado.
   * DELETE /providers/me/services/{id}/
   */
  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/providers/me/services/${id}/`)
  },

  /**
   * Lista os serviços públicos de um prestador pelo slug.
   * GET /providers/{slug}/services/
   */
  getPublicServices: async (slug: string): Promise<Service[]> => {
    const { data } = await api.get<Service[]>(`/providers/${slug}/services/`)
    return data
  },
}
