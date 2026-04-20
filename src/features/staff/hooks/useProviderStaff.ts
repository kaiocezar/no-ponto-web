import { useQuery } from '@tanstack/react-query'

import { staffApi } from '../api/staffApi'
import { staffKeys } from './staffKeys'

export function useProviderStaff() {
  return useQuery({
    queryKey: staffKeys.all,
    queryFn: staffApi.list,
    staleTime: 1000 * 60 * 5,
  })
}
