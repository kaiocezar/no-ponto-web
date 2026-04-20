import { cn } from '@utils/cn'
import { useProviderStaff } from '@features/staff/hooks/useProviderStaff'
import { Avatar } from '@components/ui/Avatar'

interface StaffMultiSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
  error?: string
}

export function StaffMultiSelect({ value, onChange, error }: StaffMultiSelectProps) {
  const { data: staff = [], isLoading } = useProviderStaff()
  const activeStaff = staff.filter((s) => s.is_active)

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  if (isLoading) {
    return <p className="text-[13px] text-slate-400">Carregando profissionais…</p>
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-slate-700">
        Profissionais (deixe vazio = qualquer disponível)
      </span>
      {activeStaff.length === 0 ? (
        <p className="text-[12px] text-slate-400">Nenhum profissional ativo cadastrado.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {activeStaff.map((s) => {
            const selected = value.includes(s.id)
            return (
              <label
                key={s.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors',
                  selected
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-slate-200 hover:bg-slate-50',
                )}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => { toggle(s.id) }}
                  className="h-4 w-4 rounded border-slate-300 accent-primary-600"
                />
                <Avatar name={s.name} size={24} />
                <span className="text-[13px] text-slate-800">{s.name}</span>
                <span className="ml-auto text-[11px] text-slate-400 capitalize">{s.role}</span>
              </label>
            )
          })}
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
