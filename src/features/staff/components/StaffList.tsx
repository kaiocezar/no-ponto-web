import { useState } from 'react'
import toast from 'react-hot-toast'

import { Avatar } from '@components/ui/Avatar'
import { Badge } from '@components/ui/Badge'
import { Button } from '@components/ui/Button'
import { useDeactivateStaff } from '../hooks/useDeactivateStaff'
import { useResendInvite } from '../hooks/useResendInvite'
import type { Staff, StaffRole } from '@/types/api'

const ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'Proprietário',
  manager: 'Gerente',
  practitioner: 'Profissional',
}

interface StaffListProps {
  staff: Staff[]
  onEdit: (member: Staff) => void
}

export function StaffList({ staff, onEdit }: StaffListProps) {
  const deactivate = useDeactivateStaff()
  const resend = useResendInvite()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (staff.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Nenhum profissional cadastrado ainda.
      </p>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {staff.map((member) => {
        const isPendingInvite = !member.user && !!member.invite_email

        return (
          <div key={member.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar name={member.name} size={36} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-800">{member.name}</p>
              <p className="truncate text-[11px] text-slate-400">
                {member.invite_email ?? member.user?.name ?? ''}
              </p>
            </div>

            <Badge variant="default">{ROLE_LABELS[member.role]}</Badge>

            {isPendingInvite && (
              <Badge variant="amber">Convite pendente</Badge>
            )}

            <Badge variant={member.is_active ? 'green' : 'default'}>
              {member.is_active ? 'Ativo' : 'Inativo'}
            </Badge>

            <div className="flex items-center gap-1">
              {isPendingInvite && (
                <Button
                  size="sm"
                  variant="ghost"
                  isLoading={resend.isPending}
                  onClick={() => {
                    resend.mutate(member.id, {
                      onSuccess: () => { toast.success('Convite reenviado') },
                      onError: () => { toast.error('Erro ao reenviar convite') },
                    })
                  }}
                >
                  Reenviar
                </Button>
              )}
              <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { onEdit(member) }}
                >
                Editar
              </Button>
              {member.role !== 'owner' && member.is_active && (
                <>
                  {confirmId === member.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="danger"
                        isLoading={deactivate.isPending}
                        onClick={() => {
                          deactivate.mutate(member.id, {
                            onSuccess: () => {
                              toast.success('Profissional desativado')
                              setConfirmId(null)
                            },
                            onError: () => { toast.error('Erro ao desativar') },
                          })
                        }}
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setConfirmId(null) }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => { setConfirmId(member.id) }}
                    >
                      Desativar
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
