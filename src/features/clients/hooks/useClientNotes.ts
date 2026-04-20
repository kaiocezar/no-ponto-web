import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { clientsApi } from '../api/clientsApi'
import { clientKeys } from './clientKeys'
import type { CreateClientNotePayload } from '@/types/api'

export function useClientNotes(phone: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: clientKeys.notes(phone),
    queryFn: () => clientsApi.listNotes(phone),
    enabled: Boolean(phone),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (payload: CreateClientNotePayload) => clientsApi.createNote(phone, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.notes(phone) })
    },
  })

  return { ...query, create }
}
