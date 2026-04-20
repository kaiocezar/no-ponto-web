import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useCreateService } from '../hooks/useCreateService'
import { useUpdateService } from '../hooks/useUpdateService'
import { PriceField } from './PriceField'
import { ColorPicker } from './ColorPicker'
import { StaffMultiSelect } from './StaffMultiSelect'
import type { Service } from '@/types/api'

const serviceSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional(),
    duration_minutes: z
      .number({ invalid_type_error: 'Duração obrigatória' })
      .int()
      .min(1, 'Mínimo 1 minuto'),
    buffer_after: z.number().int().min(0).optional().default(0),
    price: z.string().nullable(),
    currency: z.string().default('BRL'),
    color: z.string().nullable().default(null),
    requires_deposit: z.boolean().default(false),
    deposit_amount: z.string().nullable().default(null),
    max_clients: z.number().int().min(1).default(1),
    staff_ids: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.requires_deposit && !data.deposit_amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o valor do depósito',
        path: ['deposit_amount'],
      })
    }
  })

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  service?: Service | null
  onClose: () => void
}

function toFormValues(service: Service): ServiceFormValues {
  return {
    name: service.name,
    description: service.description,
    duration_minutes: service.duration_minutes,
    buffer_after: service.buffer_after,
    price: service.price,
    currency: service.currency,
    color: service.color,
    requires_deposit: service.requires_deposit,
    deposit_amount: service.deposit_amount,
    max_clients: service.max_clients,
    staff_ids: service.staff.map((s) => s.id),
  }
}

export function ServiceForm({ service, onClose }: ServiceFormProps) {
  const create = useCreateService()
  const update = useUpdateService()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service != null
      ? toFormValues(service)
      : {
          name: '',
          description: '',
          duration_minutes: 60,
          buffer_after: 0,
          price: '',
          currency: 'BRL',
          color: null,
          requires_deposit: false,
          deposit_amount: null,
          max_clients: 1,
          staff_ids: [],
        },
  })

  useEffect(() => {
    if (service) reset(toFormValues(service))
  }, [service, reset])

  const requiresDeposit = watch('requires_deposit')

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        price: values.price === '' ? null : values.price,
        deposit_amount: values.deposit_amount === '' ? null : values.deposit_amount,
      }
      if (service != null) {
        await update.mutateAsync({ id: service.id, data: payload })
        toast.success('Serviço atualizado')
      } else {
        await create.mutateAsync(payload)
        toast.success('Serviço criado')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar serviço')
    }
  })

  return (
    <form onSubmit={(e) => { void onSubmit(e) }} className="flex flex-col gap-4">
      <Input
        label="Nome *"
        {...register('name')}
        error={errors.name?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-slate-700">Descrição</label>
        <textarea
          {...register('description')}
          rows={2}
          className="w-full rounded-lg border-[1.5px] border-slate-200 px-3 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
          placeholder="Descreva brevemente o serviço…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="duration_minutes" className="text-[12px] font-semibold text-slate-700">
            Duração (min) *
          </label>
          <input
            id="duration_minutes"
            type="number"
            min={1}
            {...register('duration_minutes', { valueAsNumber: true })}
            className="w-full rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px] focus:border-primary-600 focus:outline-none"
          />
          {errors.duration_minutes && (
            <p className="text-xs text-red-600">{errors.duration_minutes.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="buffer_after" className="text-[12px] font-semibold text-slate-700">
            Intervalo após (min)
          </label>
          <input
            id="buffer_after"
            type="number"
            min={0}
            {...register('buffer_after', { valueAsNumber: true })}
            className="w-full rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px] focus:border-primary-600 focus:outline-none"
          />
        </div>
      </div>

      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <PriceField
            value={field.value ?? null}
            onChange={field.onChange}
            error={errors.price?.message}
          />
        )}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requires_deposit"
          {...register('requires_deposit')}
          className="h-4 w-4 rounded border-slate-300 accent-primary-600"
        />
        <label htmlFor="requires_deposit" className="text-[13px] text-slate-700 cursor-pointer">
          Exige depósito
        </label>
      </div>

      {requiresDeposit && (
        <Input
          label="Valor do depósito *"
          type="number"
          min={0}
          step="0.01"
          {...register('deposit_amount')}
          error={errors.deposit_amount?.message}
        />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-slate-700">Máx. clientes simultâneos</label>
        <input
          type="number"
          min={1}
          {...register('max_clients', { valueAsNumber: true })}
          className="w-24 rounded-lg border-[1.5px] border-slate-200 px-3 py-[10px] text-[13px] focus:border-primary-600 focus:outline-none"
        />
      </div>

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <ColorPicker
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="staff_ids"
        control={control}
        render={({ field }) => (
          <StaffMultiSelect
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {service != null ? 'Salvar alterações' : 'Criar serviço'}
        </Button>
      </div>
    </form>
  )
}
