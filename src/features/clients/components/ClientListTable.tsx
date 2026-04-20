import { Link } from 'react-router-dom'

import { Card } from '@components/ui/Card'
import type { ProviderClient } from '@/types/api'

interface ClientListTableProps {
  items: ProviderClient[]
}

export function ClientListTable({ items }: ClientListTableProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Telefone</th>
            <th className="px-4 py-3">Agendamentos</th>
            <th className="px-4 py-3">Último atendimento</th>
          </tr>
        </thead>
        <tbody>
          {items.map((client) => (
            <tr key={client.client_phone} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link to={`/painel/clientes/${encodeURIComponent(client.client_phone)}`} className="hover:underline">
                  {client.client_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{client.client_phone}</td>
              <td className="px-4 py-3 text-slate-600">{client.total_appointments}</td>
              <td className="px-4 py-3 text-slate-600">
                {new Intl.DateTimeFormat('pt-BR').format(new Date(client.last_appointment_date))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
