import { Badge } from '@components/ui/Badge'

interface CancellationRateBadgeProps {
  rate: number
}

function getVariant(rate: number): 'green' | 'amber' | 'red' {
  if (rate < 10) return 'green'
  if (rate <= 20) return 'amber'
  return 'red'
}

export function CancellationRateBadge({ rate }: CancellationRateBadgeProps) {
  return <Badge variant={getVariant(rate)}>Taxa de cancelamento: {rate.toFixed(1)}%</Badge>
}
