import { useMutation, useQuery } from '@tanstack/react-query'

import { reviewsApi } from '../api/reviewsApi'
import { reviewKeys } from './reviewKeys'
import type { SubmitReviewPayload } from '@/types/api'

export function useReviewByToken(token: string) {
  return useQuery({
    queryKey: reviewKeys.byToken(token),
    queryFn: () => reviewsApi.getByToken(token),
    enabled: Boolean(token),
    retry: false,
  })
}

export function useSubmitReview(token: string) {
  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => reviewsApi.submitByToken(token, payload),
  })
}
