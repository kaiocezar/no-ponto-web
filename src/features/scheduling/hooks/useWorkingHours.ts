import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulingApi } from '../api/schedulingApi'
import { schedulingKeys } from './schedulingKeys'
import type { WorkingHoursPayload, WorkingHoursBulkPayload } from '@/types/api'

export function useWorkingHours() {
  return useQuery({
    queryKey: schedulingKeys.workingHours.list(),
    queryFn: schedulingApi.listWorkingHours,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useCreateWorkingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: WorkingHoursPayload) => schedulingApi.createWorkingHours(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.workingHours.all })
    },
  })
}

export function useUpdateWorkingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WorkingHoursPayload }) =>
      schedulingApi.updateWorkingHours(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.workingHours.all })
    },
  })
}

export function useDeleteWorkingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulingApi.deleteWorkingHours(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.workingHours.all })
    },
  })
}

export function useBulkWorkingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: WorkingHoursBulkPayload) => schedulingApi.bulkWorkingHours(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schedulingKeys.workingHours.all })
    },
  })
}
