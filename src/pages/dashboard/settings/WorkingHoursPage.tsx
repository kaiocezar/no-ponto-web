import { useWorkingHours } from '@/features/scheduling/hooks/useWorkingHours'
import { WorkingHoursForm } from '@/features/scheduling/components/WorkingHoursForm'

export default function WorkingHoursPage() {
  const { data: workingHours, isLoading } = useWorkingHours()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Horários de Funcionamento</h1>
        <p className="mt-1 text-gray-500">
          Configure os dias e horários em que você atende clientes.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <WorkingHoursForm initialData={workingHours ?? []} />
      </div>
    </div>
  )
}
