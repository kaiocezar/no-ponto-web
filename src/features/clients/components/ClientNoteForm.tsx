import { useState } from 'react'

import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { Input } from '@components/ui/Input'
import type { ClientNote } from '@/types/api'

interface ClientNoteFormProps {
  notes: ClientNote[]
  isPending: boolean
  onSubmit: (note: string) => void
}

export function ClientNoteForm({ notes, isPending, onSubmit }: ClientNoteFormProps) {
  const [note, setNote] = useState('')

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Notas internas</h2>
      <div className="space-y-3">
        <Input
          label="Nova nota"
          placeholder="Ex: prefere horário da manhã"
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
          }}
        />
        <Button
          size="sm"
          isLoading={isPending}
          onClick={() => {
            if (!note.trim()) return
            onSubmit(note.trim())
            setNote('')
          }}
        >
          Salvar nota
        </Button>
      </div>

      <ul className="mt-4 space-y-2">
        {notes.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
            <p className="text-sm text-slate-800">{item.note}</p>
            <p className="text-xs text-slate-500">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
                new Date(item.created_at),
              )}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
