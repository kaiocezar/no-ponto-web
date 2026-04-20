import { useState } from 'react'

import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { StaffList } from '@features/staff/components/StaffList'
import { InviteStaffModal } from '@features/staff/components/InviteStaffModal'
import { EditStaffModal } from '@features/staff/components/EditStaffModal'
import { useProviderStaff } from '@features/staff/hooks/useProviderStaff'
import type { Staff } from '@/types/api'

export default function StaffPage() {
  const { data: staff = [], isLoading } = useProviderStaff()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Staff | null>(null)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os profissionais do seu estabelecimento.
          </p>
        </div>
        <Button onClick={() => { setInviteOpen(true) }}>+ Convidar profissional</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <Card>
          <StaffList
            staff={staff}
            onEdit={(member) => { setEditingMember(member) }}
          />
        </Card>
      )}

      <InviteStaffModal open={inviteOpen} onClose={() => { setInviteOpen(false) }} />
      <EditStaffModal
        member={editingMember}
        onClose={() => { setEditingMember(null) }}
      />
    </div>
  )
}
