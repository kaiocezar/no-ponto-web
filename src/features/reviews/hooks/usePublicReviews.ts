import { useQuery } from '@tanstack/react-query'

import { reviewsApi } from '../api/reviewsApi'
import { reviewKeys } from './reviewKeys'

export function usePublicReviews(slug: string) {
  return useQuery({
    queryKey: reviewKeys.publicList(slug),
    queryFn: () => reviewsApi.listPublicReviews(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })
}

export function usePublicReviewSummary(slug: string) {
  return useQuery({
    queryKey: reviewKeys.publicSummary(slug),
    queryFn: () => reviewsApi.publicSummary(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })
}
