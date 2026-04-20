import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { reviewsApi } from '../api/reviewsApi'
import { reviewKeys } from './reviewKeys'

export function useProviderReviews(rating?: number) {
  return useQuery({
    queryKey: reviewKeys.provider(rating),
    queryFn: () => reviewsApi.listProviderReviews(rating),
    staleTime: 30_000,
  })
}

export function useReplyReview(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reply: string) => reviewsApi.replyReview(id, { reply }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}

export function useToggleReviewVisibility(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reviewsApi.toggleReviewVisibility(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}
