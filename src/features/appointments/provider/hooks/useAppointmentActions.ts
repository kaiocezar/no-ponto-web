import { useMutation, useQueryClient } from '@tanstack/react-query'

import { providerAppointmentsApi } from '../api/providerAppointmentsApi'
import { providerAppointmentKeys } from './providerAppointmentKeys'

export function useAppointmentActions() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: providerAppointmentKeys.all })
  }

  const confirm = useMutation({
    mutationFn: (id: string) => providerAppointmentsApi.confirm(id),
    onSuccess: invalidate,
  })

  const complete = useMutation({
    mutationFn: (id: string) => providerAppointmentsApi.complete(id),
    onSuccess: invalidate,
  })

  const noShow = useMutation({
    mutationFn: (id: string) => providerAppointmentsApi.noShow(id),
    onSuccess: invalidate,
  })

  const cancel = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string | null }) =>
      providerAppointmentsApi.cancel(id, { reason }),
    onSuccess: invalidate,
  })

  return { confirm, complete, noShow, cancel }
}
