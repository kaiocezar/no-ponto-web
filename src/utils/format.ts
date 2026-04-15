/**
 * Formata um valor monetário em BRL.
 * @example formatCurrency(150.5) → "R$ 150,50"
 */
export function formatCurrency(value: number | string | null): string {
  if (value === null) return 'A combinar'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

/**
 * Formata uma data ISO 8601 para exibição em pt-BR.
 * @example formatDate('2026-04-13T09:00:00-03:00') → "13 de abril de 2026"
 */
export function formatDate(isoString: string, timeZone = 'America/Sao_Paulo'): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(isoString))
}

/**
 * Formata uma data ISO 8601 para exibição de hora em pt-BR.
 * @example formatTime('2026-04-13T09:00:00-03:00') → "09:00"
 */
export function formatTime(isoString: string, timeZone = 'America/Sao_Paulo'): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(isoString))
}

/**
 * Formata duração em minutos para texto legível.
 * @example formatDuration(90) → "1h 30min"
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m.toString()}min`
  if (m === 0) return `${h.toString()}h`
  return `${h.toString()}h ${m.toString()}min`
}

/**
 * Formata número de telefone brasileiro.
 * @example formatPhone('+5511999999999') → "(11) 99999-9999"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '').replace(/^55/, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}
