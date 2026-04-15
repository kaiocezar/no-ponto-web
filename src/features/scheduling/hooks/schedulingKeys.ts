import type { ScheduleBlockFilters } from '@/types/api'

export const schedulingKeys = {
  workingHours: {
    all: ['working-hours'] as const,
    list: () => ['working-hours', 'list'] as const,
  },
  blocks: {
    all: ['schedule-blocks'] as const,
    list: (filters?: ScheduleBlockFilters) =>
      ['schedule-blocks', 'list', filters] as const,
  },
  availability: {
    all: ['availability'] as const,
    detail: (slug: string, serviceId: string, date: string, staffId?: string) =>
      ['availability', slug, serviceId, date, staffId] as const,
  },
}
