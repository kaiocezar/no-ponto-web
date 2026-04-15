import { useState } from 'react'
import { useScheduleBlocks, useDeleteScheduleBlock } from '@/features/scheduling/hooks/useScheduleBlocks'
import { ScheduleBlockModal } from '@/features/scheduling/components/ScheduleBlockModal'
import type { ScheduleBlock } from '@/types/api'
import { Button } from '@/components/ui/Button'

function formatDatetime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })
}

export default function ScheduleBlocksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | undefined>()

  const { data: blocks, isLoading } = useScheduleBlocks()
  const deleteMutation = useDeleteScheduleBlock()

  const handleEdit = (block: ScheduleBlock) => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Confirmar exclusão do bloqueio?')) {
      void deleteMutation.mutateAsync(id)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingBlock(undefined)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bloqueios de Agenda</h1>
          <p className="mt-1 text-gray-500">
            Gerencie períodos em que você não estará disponível para atendimentos.
          </p>
        </div>
        <Button
          onClick={() => { setIsModalOpen(true) }}
          aria-label="Criar novo bloqueio"
        >
          + Novo bloqueio
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : !blocks || blocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-gray-500">Nenhum bloqueio configurado.</p>
          <button
            onClick={() => { setIsModalOpen(true) }}
            className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Criar primeiro bloqueio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDatetime(block.start_datetime)} — {formatDatetime(block.end_datetime)}
                  </p>
                  {block.reason && (
                    <p className="mt-1 text-sm text-gray-500">{block.reason}</p>
                  )}
                  {block.is_recurring && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Recorrente
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { handleEdit(block) }}
                    aria-label={`Editar bloqueio de ${formatDatetime(block.start_datetime)}`}
                    className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => { handleDelete(block.id) }}
                    aria-label={`Excluir bloqueio de ${formatDatetime(block.start_datetime)}`}
                    className="rounded px-2 py-1 text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ScheduleBlockModal
          block={editingBlock}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
