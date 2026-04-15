import api from '@lib/api'
import type { ProviderProfile, ServiceCategory } from '@/types/api'

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
}
