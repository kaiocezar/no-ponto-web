import { cn } from '@utils/cn'

interface SlugPreviewProps {
  businessName: string
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function SlugPreview({ businessName }: SlugPreviewProps) {
  const slug = slugify(businessName)
  const isEmpty = !slug

  return (
    <p className={cn('text-sm', isEmpty ? 'text-gray-400' : 'text-gray-600')}>
      agendador.app/
      <strong className={cn('font-semibold', isEmpty ? 'text-gray-400' : 'text-gray-800')}>
        {isEmpty ? 'seu-negocio' : slug}
      </strong>
    </p>
  )
}
