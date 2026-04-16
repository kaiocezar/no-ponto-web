import { useQuery } from '@tanstack/react-query'
import { schedulingApi } from '../api/schedulingApi'
import { schedulingKeys } from './schedulingKeys'

interface UseAvailabilityParams {
  slug: string
  serviceId: string
  date: string
  staffId?: string
  /** Se omitido, habilita quando slug, serviceId e date estão preenchidos. */
  enabled?: boolean
}

export function useAvailability({
  slug,
  serviceId,
  date,
  staffId,
  enabled,
}: UseAvailabilityParams) {
  return useQuery({
    queryKey: schedulingKeys.availability.detail(slug, serviceId, date, staffId),
    queryFn: () =>
      schedulingApi.getAvailability(slug, {
        service_id: serviceId,
        date,
        staff_id: staffId,
      }),
    enabled: enabled ?? Boolean(slug && serviceId && date),
    staleTime: 1000 * 60 * 5, // 5 minutos — alinhado com cache Redis do backend
  })
}
