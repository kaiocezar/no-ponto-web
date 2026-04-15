import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitário para combinar classes Tailwind sem conflitos.
 * Usa clsx para lógica condicional + twMerge para deduplicar classes conflitantes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6') // → 'py-2 bg-blue-500 px-6'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
