import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulingApi } from '../api/schedulingApi'
import { schedulingKeys } from './schedulingKeys'
import type { ScheduleBlockFilters, ScheduleBlockPayload } from '@/types/api'

export function useScheduleBlocks(filters?: ScheduleBlockFilters) {
  return useQuery({
    queryKey: schedulingKeys.blocks.list(filters),
    queryFn: () => schedulingApi.listBlocks(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateScheduleBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ScheduleBlockPayload) => schedulingApi.createBlock(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.blocks.all })
    },
  })
}

export function useUpdateScheduleBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ScheduleBlockPayload }) =>
      schedulingApi.updateBlock(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.blocks.all })
    },
  })
}

export function useDeleteScheduleBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulingApi.deleteBlock(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.blocks.all })
    },
  })
}
