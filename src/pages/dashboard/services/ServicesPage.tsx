import { useState } from 'react'

import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { ServiceList } from '@features/services/components/ServiceList'
import { ServiceForm } from '@features/services/components/ServiceForm'
import { useProviderServices } from '@features/services/hooks/useProviderServices'
import type { Service } from '@/types/api'

export default function ServicesPage() {
  const { data: services = [], isLoading } = useProviderServices()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const openCreate = () => {
    setEditingService(null)
    setModalOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingService(null)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os serviços oferecidos pelo seu estabelecimento.
          </p>
        </div>
        <Button onClick={openCreate}>+ Novo serviço</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <Card>
          <ServiceList services={services} onEdit={openEdit} />
        </Card>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-[15px] font-semibold text-slate-900">
                {editingService ? 'Editar serviço' : 'Novo serviço'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto px-6 py-4">
              <ServiceForm service={editingService} onClose={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
