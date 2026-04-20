import toast from 'react-hot-toast'

import { Badge } from '@components/ui/Badge'
import { Button } from '@components/ui/Button'
import { useToggleServiceStatus } from '../hooks/useToggleServiceStatus'
import type { Service } from '@/types/api'

interface ServiceListProps {
  services: Service[]
  onEdit: (service: Service) => void
}

function formatPrice(service: Service): string {
  if (service.price === null) return 'A combinar'
  const n = parseFloat(service.price)
  return isNaN(n)
    ? service.price
    : n.toLocaleString('pt-BR', { style: 'currency', currency: service.currency })
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${String(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${String(h)}h` : `${String(h)}h ${String(m)}min`
}

export function ServiceList({ services, onEdit }: ServiceListProps) {
  const toggle = useToggleServiceStatus()

  const handleToggle = (service: Service) => {
    toggle.mutate(
      { id: service.id, active: !service.is_active },
        {
          onSuccess: () => {
            toast.success(service.is_active ? 'Serviço desativado' : 'Serviço ativado')
          },
          onError: () => { toast.error('Erro ao alterar status') },
        },
    )
  }

  if (services.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Nenhum serviço cadastrado ainda.
      </p>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-4 px-4 py-3">
          {/* Color dot */}
          <span
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: service.color ?? '#64748b' }}
          />

          {/* Name + description */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-800">{service.name}</p>
            {service.description && (
              <p className="truncate text-[11px] text-slate-400">{service.description}</p>
            )}
          </div>

          {/* Duration */}
          <span className="hidden w-20 text-right text-[12px] text-slate-500 sm:block">
            {formatDuration(service.duration_minutes)}
          </span>

          {/* Price */}
          <span className="hidden w-24 text-right text-[12px] text-slate-600 sm:block">
            {formatPrice(service)}
          </span>

          {/* Status badge */}
          <Badge variant={service.is_active ? 'green' : 'default'}>
            {service.is_active ? 'Ativo' : 'Inativo'}
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { onEdit(service) }}
              aria-label="Editar serviço"
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant={service.is_active ? 'secondary' : 'ghost'}
              onClick={() => { handleToggle(service) }}
              isLoading={toggle.isPending}
            >
              {service.is_active ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
