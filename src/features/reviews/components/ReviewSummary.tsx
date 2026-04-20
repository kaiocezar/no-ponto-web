import { Card } from '@components/ui/Card'
import type { PublicReviewSummary } from '@/types/api'

interface ReviewSummaryProps {
  summary: PublicReviewSummary
}

export function ReviewSummary({ summary }: ReviewSummaryProps) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-slate-900">Avaliações</h3>
      <p className="mt-1 text-2xl font-bold text-slate-900">{summary.average_rating.toFixed(1)}</p>
      <p className="text-xs text-slate-500">{summary.total_reviews} avaliações</p>
      <div className="mt-3 space-y-1">
        {(['5', '4', '3', '2', '1'] as const).map((score) => (
          <p key={score} className="text-xs text-slate-600">
            {score}★: {summary.rating_distribution[score]}
          </p>
        ))}
      </div>
    </Card>
  )
}
