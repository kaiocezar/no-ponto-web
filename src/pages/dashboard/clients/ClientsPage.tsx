import { useState } from 'react'

import { ClientListTable } from '@features/clients/components/ClientListTable'
import { ClientSearch } from '@features/clients/components/ClientSearch'
import { useProviderClients } from '@features/clients/hooks/useProviderClients'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const { data = [], isLoading } = useProviderClients(search)

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
        <p className="text-sm text-slate-500">Busque e consulte histórico de atendimentos.</p>
      </div>

      <ClientSearch value={search} onChange={setSearch} />

      {isLoading ? (
        <p className="text-sm text-slate-500">Carregando clientes...</p>
      ) : (
        <ClientListTable items={data} />
      )}
    </div>
  )
}
