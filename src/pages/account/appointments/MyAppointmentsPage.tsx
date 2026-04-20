import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '@components/ui/Card'
import { MyAppointmentsTabs } from '@features/appointments/client/components/MyAppointmentsTabs'
import { useMyAppointments } from '@features/appointments/client/hooks/useMyAppointments'
import type { MyAppointmentsFilterStatus } from '@/types/api'

function renderStars(count: number) {
  return '★'.repeat(count) + '☆'.repeat(5 - count)
}

export default function MyAppointmentsPage() {
  const [status, setStatus] = useState<MyAppointmentsFilterStatus>('upcoming')
  const { data, isLoading } = useMyAppointments(status)
  const items = data?.data ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Meus agendamentos</h1>
        <p className="text-sm text-slate-500">Acompanhe os próximos e os atendimentos anteriores.</p>
      </div>

      <MyAppointmentsTabs active={status} onChange={setStatus} />

      {isLoading ? (
        <p className="text-sm text-slate-500">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <p className="text-sm font-semibold text-slate-900">{item.service_name}</p>
              <p className="text-xs text-slate-500">
                {item.provider_name} ·{' '}
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(item.start_datetime))}
              </p>

              {status === 'past' && item.review_status === 'pending' && item.review_token ? (
                <Link
                  to={`/avaliar/${item.review_token}`}
                  className="mt-2 inline-flex rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  Avaliar ⭐
                </Link>
              ) : null}

              {status === 'past' && item.review_status === 'completed' && item.review_rating ? (
                <p className="mt-2 text-sm text-amber-600">{renderStars(item.review_rating)}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
