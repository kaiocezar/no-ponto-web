import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useUpdateStaff } from '../hooks/useUpdateStaff'
import type { Staff } from '@/types/api'

const editSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  role: z.enum(['manager', 'practitioner']),
})

type EditFormValues = z.infer<typeof editSchema>

interface EditStaffModalProps {
  member: Staff | null
  onClose: () => void
}

export function EditStaffModal({ member, onClose }: EditStaffModalProps) {
  const update = useUpdateStaff()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    values: {
      name: member?.name ?? '',
      role: member?.role === 'owner' || member?.role == null ? 'practitioner' : member.role,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    if (!member) return
    try {
      await update.mutateAsync({ id: member.id, data: values })
      toast.success('Profissional atualizado')
      onClose()
    } catch {
      toast.error('Erro ao atualizar profissional')
    }
  })

  if (!member) return null

  const isOwner = member.role === 'owner'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Editar profissional</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => { void onSubmit(e) }}
          className="flex flex-col gap-4 px-6 py-4"
        >
          <Input
            label="Nome *"
            {...register('name')}
            error={errors.name?.message}
          />

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-700">Papel</label>
            {isOwner ? (
              <p className="text-[13px] text-slate-500">Proprietário (não alterável)</p>
            ) : (
              <select
                {...register('role')}
                className="w-full rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px] text-slate-900 focus:border-primary-600 focus:outline-none"
              >
                <option value="practitioner">Profissional</option>
                <option value="manager">Gerente</option>
              </select>
            )}
            {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
