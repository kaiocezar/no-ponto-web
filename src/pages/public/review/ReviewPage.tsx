import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { StarRatingSelector } from '@features/reviews/components/StarRatingSelector'
import { useReviewByToken, useSubmitReview } from '@features/reviews/hooks/useReviewByToken'

export default function ReviewPage() {
  const { token = '' } = useParams<{ token: string }>()
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const reviewQuery = useReviewByToken(token)
  const submitReview = useSubmitReview(token)

  if (reviewQuery.isLoading) {
    return <div className="mx-auto max-w-xl px-4 py-10 text-sm text-slate-500">Carregando...</div>
  }

  if (reviewQuery.isError || !reviewQuery.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Link inválido ou expirado</h1>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Avaliação enviada</h1>
        <p className="mt-2 text-sm text-slate-600">Obrigado pelo seu feedback.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Como foi seu atendimento?</h1>
        <p className="text-sm text-slate-500">
          {reviewQuery.data.provider_name} · {reviewQuery.data.service_name}
        </p>
      </div>

      <StarRatingSelector value={rating} onChange={setRating} />
      <Input
        label="Comentário (opcional)"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value)
        }}
        placeholder="Conte como foi sua experiência"
      />
      <Button
        isLoading={submitReview.isPending}
        onClick={() => {
          submitReview.mutate(
            { rating, comment },
            {
              onSuccess: () => {
                setSent(true)
              },
            },
          )
        }}
      >
        Enviar avaliação
      </Button>
    </div>
  )
}
