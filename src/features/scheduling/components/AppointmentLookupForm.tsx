import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AppointmentLookupFormProps {
  isLoading?: boolean
  onSubmit: (phone: string) => void
}

export function AppointmentLookupForm({ isLoading = false, onSubmit }: AppointmentLookupFormProps) {
  const [phone, setPhone] = useState('')

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedPhone = phone.trim()
    if (!normalizedPhone) return
    onSubmit(normalizedPhone)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Telefone"
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value)
        }}
        placeholder="+55 11 99999-9999"
      />
      <Button type="submit" isLoading={isLoading}>
        Consultar agendamento
      </Button>
    </form>
  )
}
