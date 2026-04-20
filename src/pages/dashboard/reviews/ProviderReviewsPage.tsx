import toast from 'react-hot-toast'

import { ReviewCard } from '@features/reviews/components/ReviewCard'
import { ReviewSummary } from '@features/reviews/components/ReviewSummary'
import {
  useProviderReviews,
  useReplyReview,
  useToggleReviewVisibility,
} from '@features/reviews/hooks/useProviderReviews'
import { useProviderProfile } from '@features/providers/hooks/useProviderProfile'
import { usePublicReviewSummary } from '@features/reviews/hooks/usePublicReviews'
import type { ProviderReview } from '@/types/api'

export default function ProviderReviewsPage() {
  const reviewsQuery = useProviderReviews()
  const { data: profile } = useProviderProfile()
  const summaryQuery = usePublicReviewSummary(profile?.slug ?? '')
  const reviews = reviewsQuery.data?.data ?? []

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Avaliações</h1>
        <p className="text-sm text-slate-500">Gerencie feedbacks recebidos dos clientes.</p>
      </div>

      {summaryQuery.data ? <ReviewSummary summary={summaryQuery.data} /> : null}

      <div className="space-y-3">
        {reviews.map((review) => (
          <ProviderReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}

function ProviderReviewItem({ review }: { review: ProviderReview }) {
  const replyMutation = useReplyReview(review.id)
  const toggleMutation = useToggleReviewVisibility(review.id)

  return (
    <ReviewCard
      review={review}
      onReply={(reply) => {
        replyMutation.mutate(reply, {
          onSuccess: () => toast.success('Resposta enviada'),
          onError: () => toast.error('Não foi possível responder'),
        })
      }}
      onToggleVisibility={() => {
        toggleMutation.mutate(undefined, {
          onSuccess: () => toast.success('Visibilidade atualizada'),
          onError: () => toast.error('Não foi possível atualizar visibilidade'),
        })
      }}
    />
  )
}
