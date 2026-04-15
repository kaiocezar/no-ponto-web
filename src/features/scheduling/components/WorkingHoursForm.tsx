import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { WorkingHours, Weekday } from '@/types/api'
import { WEEKDAY_LABELS } from '@/types/api'
import { useBulkWorkingHours } from '../hooks/useWorkingHours'
import { Button } from '@/components/ui/Button'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const daySchema = z.object({
  is_active: z.boolean(),
  start_time: z.string().regex(timeRegex, 'Formato inválido (HH:MM)'),
  end_time: z.string().regex(timeRegex, 'Formato inválido (HH:MM)'),
})

const formSchema = z.object({
  days: z.array(daySchema).length(7),
})

type FormData = z.infer<typeof formSchema>

interface WorkingHoursFormProps {
  initialData?: WorkingHours[]
  onSuccess?: () => void
}

const DEFAULT_START = '08:00'
const DEFAULT_END = '18:00'
const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6]

// Nomes de campo tipados estritamente para evitar erros de template literal com number
const DAY_FIELD_NAMES: Array<{
  is_active: `days.${number}.is_active`
  start_time: `days.${number}.start_time`
  end_time: `days.${number}.end_time`
}> = [
  { is_active: 'days.0.is_active', start_time: 'days.0.start_time', end_time: 'days.0.end_time' },
  { is_active: 'days.1.is_active', start_time: 'days.1.start_time', end_time: 'days.1.end_time' },
  { is_active: 'days.2.is_active', start_time: 'days.2.start_time', end_time: 'days.2.end_time' },
  { is_active: 'days.3.is_active', start_time: 'days.3.start_time', end_time: 'days.3.end_time' },
  { is_active: 'days.4.is_active', start_time: 'days.4.start_time', end_time: 'days.4.end_time' },
  { is_active: 'days.5.is_active', start_time: 'days.5.start_time', end_time: 'days.5.end_time' },
  { is_active: 'days.6.is_active', start_time: 'days.6.start_time', end_time: 'days.6.end_time' },
]

export function WorkingHoursForm({ initialData = [], onSuccess }: WorkingHoursFormProps) {
  const bulkMutation = useBulkWorkingHours()

  const defaultDays: FormData['days'] = WEEKDAYS.map((day) => {
    const existing = initialData.find((h) => h.weekday === day)
    return {
      is_active: existing?.is_active ?? day < 5,
      start_time: existing?.start_time.substring(0, 5) ?? DEFAULT_START,
      end_time: existing?.end_time.substring(0, 5) ?? DEFAULT_END,
    }
  })

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { days: defaultDays },
  })

  const onSubmit = async (values: FormData) => {
    const payload = values.days
      .map((day, index) => ({
        weekday: WEEKDAYS[index] as Weekday,
        start_time: day.start_time,
        end_time: day.end_time,
        is_active: day.is_active,
      }))
      .filter((day) => day.is_active)

    await bulkMutation.mutateAsync({ working_hours: payload })
    onSuccess?.()
  }

  return (
    <form
      onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
      className="space-y-4"
      aria-label="Horários de funcionamento"
    >
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Dia</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ativo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Abertura</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fechamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {WEEKDAYS.map((day, index) => {
              const fieldNames = DAY_FIELD_NAMES[index]
              return (
                <tr key={day} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {WEEKDAY_LABELS[day]}
                  </td>
                  <td className="px-4 py-3">
                    <Controller
                      name={fieldNames.is_active}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          aria-label={`Ativar ${WEEKDAY_LABELS[day]}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      )}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Controller
                      name={fieldNames.start_time}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          aria-label={`Horário de abertura ${WEEKDAY_LABELS[day]}`}
                          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      )}
                    />
                    {errors.days?.[index]?.start_time && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.days[index].start_time.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Controller
                      name={fieldNames.end_time}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          aria-label={`Horário de fechamento ${WEEKDAY_LABELS[day]}`}
                          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      )}
                    />
                    {errors.days?.[index]?.end_time && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.days[index].end_time.message}
                      </p>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {bulkMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Erro ao salvar horários. Tente novamente.
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || bulkMutation.isPending}
          aria-label="Salvar horários de funcionamento"
        >
          {bulkMutation.isPending ? 'Salvando...' : 'Salvar horários'}
        </Button>
      </div>
    </form>
  )
}
