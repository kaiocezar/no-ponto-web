import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ScheduleBlock, ScheduleBlockPayload } from '@/types/api'
import { useCreateScheduleBlock, useUpdateScheduleBlock } from '../hooks/useScheduleBlocks'
import { Button } from '@/components/ui/Button'

const blockSchema = z
  .object({
    start_datetime: z.string().min(1, 'Data de início obrigatória'),
    end_datetime: z.string().min(1, 'Data de término obrigatória'),
    reason: z.string().max(500).optional(),
    is_recurring: z.boolean().default(false),
    recurrence_rule: z.string().max(500).optional(),
  })
  .refine((data) => new Date(data.start_datetime) < new Date(data.end_datetime), {
    message: 'O término deve ser posterior ao início.',
    path: ['end_datetime'],
  })
  .refine(
    (data) => !data.is_recurring || (data.recurrence_rule && data.recurrence_rule.length > 0),
    {
      message: 'Informe a regra de recorrência (RRULE).',
      path: ['recurrence_rule'],
    },
  )

type FormData = z.infer<typeof blockSchema>

interface ScheduleBlockModalProps {
  block?: ScheduleBlock
  onClose: () => void
  onSuccess?: () => void
}

export function ScheduleBlockModal({ block, onClose, onSuccess }: ScheduleBlockModalProps) {
  const isEditing = Boolean(block)
  const createMutation = useCreateScheduleBlock()
  const updateMutation = useUpdateScheduleBlock()

  const toLocalDatetime = (iso?: string) => {
    if (!iso) return ''
    return iso.substring(0, 16)
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      start_datetime: toLocalDatetime(block?.start_datetime),
      end_datetime: toLocalDatetime(block?.end_datetime),
      reason: block?.reason ?? '',
      is_recurring: block?.is_recurring ?? false,
      recurrence_rule: block?.recurrence_rule ?? '',
    },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (values: FormData) => {
    const payload: ScheduleBlockPayload = {
      start_datetime: new Date(values.start_datetime).toISOString(),
      end_datetime: new Date(values.end_datetime).toISOString(),
      reason: values.reason,
      is_recurring: values.is_recurring,
      recurrence_rule: values.is_recurring ? values.recurrence_rule : '',
    }

    if (isEditing && block) {
      await updateMutation.mutateAsync({ id: block.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onSuccess?.()
    onClose()
  }

  const isPending = createMutation.isPending || updateMutation.isPending
  const isError = createMutation.isError || updateMutation.isError

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Editar bloqueio de agenda' : 'Novo bloqueio de agenda'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar bloqueio' : 'Novo bloqueio de agenda'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
          className="space-y-4 px-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_datetime" className="mb-1 block text-sm font-medium text-gray-700">
                Início
              </label>
              <input
                id="start_datetime"
                type="datetime-local"
                {...register('start_datetime')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.start_datetime && (
                <p className="mt-1 text-xs text-red-600">{errors.start_datetime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_datetime" className="mb-1 block text-sm font-medium text-gray-700">
                Término
              </label>
              <input
                id="end_datetime"
                type="datetime-local"
                {...register('end_datetime')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.end_datetime && (
                <p className="mt-1 text-xs text-red-600">{errors.end_datetime.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
              Motivo (opcional)
            </label>
            <input
              id="reason"
              type="text"
              placeholder="Ex: Férias, Feriado, Reunião..."
              {...register('reason')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_recurring"
              control={control}
              render={({ field }) => (
                <input
                  id="is_recurring"
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              )}
            />
            <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
              Bloqueio recorrente
            </label>
          </div>

          {isRecurring && (
            <div>
              <label htmlFor="recurrence_rule" className="mb-1 block text-sm font-medium text-gray-700">
                Regra de recorrência (RRULE)
              </label>
              <input
                id="recurrence_rule"
                type="text"
                placeholder="Ex: FREQ=WEEKLY;BYDAY=FR"
                {...register('recurrence_rule')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.recurrence_rule && (
                <p className="mt-1 text-xs text-red-600">{errors.recurrence_rule.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Formato RFC 5545. Ex: FREQ=WEEKLY;BYDAY=MO,FR para toda segunda e sexta.
              </p>
            </div>
          )}

          {isError && (
            <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Erro ao salvar o bloqueio. Verifique os dados e tente novamente.
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar bloqueio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
