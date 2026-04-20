import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useInviteStaff } from '../hooks/useInviteStaff'

const inviteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  invite_email: z.string().email('E-mail inválido'),
  role: z.enum(['manager', 'practitioner']),
})

type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteStaffModalProps {
  open: boolean
  onClose: () => void
}

export function InviteStaffModal({ open, onClose }: InviteStaffModalProps) {
  const invite = useInviteStaff()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: '', invite_email: '', role: 'practitioner' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await invite.mutateAsync(values)
      toast.success('Convite enviado')
      reset()
      onClose()
    } catch {
      toast.error('Erro ao enviar convite')
    }
  })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Convidar profissional</h2>
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
          <Input
            label="E-mail *"
            type="email"
            {...register('invite_email')}
            error={errors.invite_email?.message}
          />

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-700">Papel *</label>
            <select
              {...register('role')}
              className="w-full rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px] text-slate-900 focus:border-primary-600 focus:outline-none"
            >
              <option value="practitioner">Profissional</option>
              <option value="manager">Gerente</option>
            </select>
            {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Enviar convite
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
