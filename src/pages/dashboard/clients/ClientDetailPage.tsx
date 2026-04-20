import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { ClientHistoryTimeline } from '@features/clients/components/ClientHistoryTimeline'
import { ClientNoteForm } from '@features/clients/components/ClientNoteForm'
import { useClientAppointments } from '@features/clients/hooks/useClientAppointments'
import { useClientNotes } from '@features/clients/hooks/useClientNotes'

export default function ClientDetailPage() {
  const { phone = '' } = useParams<{ phone: string }>()
  const clientPhone = decodeURIComponent(phone)

  const appointmentsQuery = useClientAppointments(clientPhone)
  const notesQuery = useClientNotes(clientPhone)

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Detalhe do cliente</h1>
        <p className="text-sm text-slate-500">{clientPhone}</p>
      </div>

      <ClientHistoryTimeline items={appointmentsQuery.data?.data ?? []} />
      <ClientNoteForm
        notes={notesQuery.data ?? []}
        isPending={notesQuery.create.isPending}
        onSubmit={(note) => {
          notesQuery.create.mutate(
            { note },
            {
              onSuccess: () => toast.success('Nota salva'),
              onError: () => toast.error('Não foi possível salvar a nota'),
            },
          )
        }}
      />
    </div>
  )
}
