import { cn } from '@utils/cn'
import { Avatar } from '@components/ui/Avatar'
import type { Staff } from '@/types/api'

interface StaffFilterTabsProps {
  staff: Staff[]
  selectedStaffId: string | null
  onChange: (staffId: string | null) => void
}

export function StaffFilterTabs({ staff, selectedStaffId, onChange }: StaffFilterTabsProps) {
  if (staff.length <= 1) return null

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar por profissional">
      <button
        role="tab"
        aria-selected={selectedStaffId === null}
        onClick={() => { onChange(null) }}
        className={cn(
          'flex-shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors',
          selectedStaffId === null
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        )}
      >
        Todos
      </button>
      {staff.map((member) => (
        <button
          key={member.id}
          role="tab"
          aria-label={member.name}
          aria-selected={selectedStaffId === member.id}
          onClick={() => { onChange(member.id) }}
          className={cn(
            'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors',
            selectedStaffId === member.id
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          <Avatar name={member.name} size={18} />
          <span>{member.name}</span>
        </button>
      ))}
    </div>
  )
}
