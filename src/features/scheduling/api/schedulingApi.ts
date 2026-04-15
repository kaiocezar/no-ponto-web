import api from '@lib/api'
import type {
  WorkingHours,
  WorkingHoursPayload,
  WorkingHoursBulkPayload,
  ScheduleBlock,
  ScheduleBlockFilters,
  ScheduleBlockPayload,
  AvailableSlot,
} from '@/types/api'

export const schedulingApi = {
  // ── Working Hours ───────────────────────────────────────────────────────────

  /**
   * Lista horários de funcionamento do prestador autenticado.
   * GET /providers/me/working-hours/
   */
  listWorkingHours: async (): Promise<WorkingHours[]> => {
    const { data } = await api.get<WorkingHours[]>('/providers/me/working-hours/')
    return data
  },

  /**
   * Cria um horário de funcionamento.
   * POST /providers/me/working-hours/
   */
  createWorkingHours: async (payload: WorkingHoursPayload): Promise<WorkingHours> => {
    const { data } = await api.post<WorkingHours>('/providers/me/working-hours/', payload)
    return data
  },

  /**
   * Atualiza um horário de funcionamento.
   * PUT /providers/me/working-hours/{id}/
   */
  updateWorkingHours: async (id: string, payload: WorkingHoursPayload): Promise<WorkingHours> => {
    const { data } = await api.put<WorkingHours>(`/providers/me/working-hours/${id}/`, payload)
    return data
  },

  /**
   * Remove um horário de funcionamento.
   * DELETE /providers/me/working-hours/{id}/
   */
  deleteWorkingHours: async (id: string): Promise<void> => {
    await api.delete(`/providers/me/working-hours/${id}/`)
  },

  /**
   * Cria/substitui todos os horários de uma vez.
   * POST /providers/me/working-hours/bulk/
   */
  bulkWorkingHours: async (payload: WorkingHoursBulkPayload): Promise<WorkingHours[]> => {
    const { data } = await api.post<WorkingHours[]>(
      '/providers/me/working-hours/bulk/',
      payload,
    )
    return data
  },

  // ── Schedule Blocks ─────────────────────────────────────────────────────────

  /**
   * Lista bloqueios de agenda.
   * GET /providers/me/blocks/
   */
  listBlocks: async (filters?: ScheduleBlockFilters): Promise<ScheduleBlock[]> => {
    const { data } = await api.get<ScheduleBlock[]>('/providers/me/blocks/', {
      params: filters,
    })
    return data
  },

  /**
   * Cria um bloqueio de agenda.
   * POST /providers/me/blocks/
   */
  createBlock: async (payload: ScheduleBlockPayload): Promise<ScheduleBlock> => {
    const { data } = await api.post<ScheduleBlock>('/providers/me/blocks/', payload)
    return data
  },

  /**
   * Atualiza um bloqueio de agenda.
   * PUT /providers/me/blocks/{id}/
   */
  updateBlock: async (id: string, payload: ScheduleBlockPayload): Promise<ScheduleBlock> => {
    const { data } = await api.put<ScheduleBlock>(`/providers/me/blocks/${id}/`, payload)
    return data
  },

  /**
   * Remove um bloqueio de agenda.
   * DELETE /providers/me/blocks/{id}/
   */
  deleteBlock: async (id: string): Promise<void> => {
    await api.delete(`/providers/me/blocks/${id}/`)
  },

  // ── Disponibilidade Pública ─────────────────────────────────────────────────

  /**
   * Retorna slots disponíveis para um prestador/serviço/data.
   * GET /providers/{slug}/availability/
   */
  getAvailability: async (
    slug: string,
    params: { service_id: string; date: string; staff_id?: string },
  ): Promise<AvailableSlot[]> => {
    const { data } = await api.get<AvailableSlot[]>(`/providers/${slug}/availability/`, {
      params,
    })
    return data
  },
}
