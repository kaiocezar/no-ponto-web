import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import type { ProviderReview, Review } from '@/types/api'

interface ReviewCardProps {
  review: Review | ProviderReview
  onReply?: (value: string) => void
  onToggleVisibility?: () => void
}

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export function ReviewCard({ review, onReply, onToggleVisibility }: ReviewCardProps) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-amber-600">{renderStars(review.rating)}</p>
      <p className="mt-1 text-sm text-slate-900">{review.client_name}</p>
      {review.comment ? <p className="mt-2 text-sm text-slate-700">{review.comment}</p> : null}
      {review.provider_reply ? (
        <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1 text-sm text-slate-700">
          Resposta: {review.provider_reply}
        </p>
      ) : null}

      {'is_public' in review ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {!review.provider_reply && onReply ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const reply = window.prompt('Digite a resposta para o cliente:')
                if (reply?.trim()) onReply(reply.trim())
              }}
            >
              Responder
            </Button>
          ) : null}
          {onToggleVisibility ? (
            <Button size="sm" variant="ghost" onClick={onToggleVisibility}>
              {review.is_public ? 'Ocultar do perfil público' : 'Exibir no perfil público'}
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}
