import { useQuery } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'
import { staffKeys } from './staffKeys'

export function usePublicStaff(slug: string, serviceId?: string) {
  return useQuery({
    queryKey: staffKeys.public(slug, serviceId),
    queryFn: () => staffApi.publicList(slug, serviceId),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}
