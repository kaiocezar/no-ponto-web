import { api } from '@lib/api'
import type {
  PaginatedResponse,
  ProviderReview,
  PublicReviewSummary,
  Review,
  ReviewByTokenData,
  ReviewReplyPayload,
  SubmitReviewPayload,
} from '@/types/api'

export const reviewsApi = {
  getByToken(token: string) {
    return api.get<ReviewByTokenData>(`/reviews/by-token/${token}/`).then((r) => r.data)
  },

  submitByToken(token: string, payload: SubmitReviewPayload) {
    return api.post(`/reviews/by-token/${token}/`, payload).then(() => undefined)
  },

  listProviderReviews(rating?: number) {
    return api
      .get<PaginatedResponse<ProviderReview>>('/providers/me/reviews/', {
        params: rating ? { rating } : undefined,
      })
      .then((r) => r.data)
  },

  replyReview(id: string, payload: ReviewReplyPayload) {
    return api.post(`/providers/me/reviews/${id}/reply/`, payload).then(() => undefined)
  },

  toggleReviewVisibility(id: string) {
    return api.post(`/providers/me/reviews/${id}/toggle-visibility/`).then(() => undefined)
  },

  listPublicReviews(slug: string) {
    return api.get<PaginatedResponse<Review>>(`/providers/${slug}/reviews/`).then((r) => r.data)
  },

  publicSummary(slug: string) {
    return api.get<PublicReviewSummary>(`/providers/${slug}/reviews/summary/`).then((r) => r.data)
  },
}
