import { Input } from '@components/ui/Input'

interface ClientSearchProps {
  value: string
  onChange: (next: string) => void
}

export function ClientSearch({ value, onChange }: ClientSearchProps) {
  return (
    <div className="max-w-md">
      <Input
        label="Buscar cliente"
        placeholder="Nome ou telefone"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
