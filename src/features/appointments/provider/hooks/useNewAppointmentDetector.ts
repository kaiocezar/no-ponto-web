import { useEffect, useRef } from 'react'

import type { ProviderAppointmentListRow } from '@/types/api'

export interface UseNewAppointmentDetectorOptions {
  /** Quando falso, não dispara toast (ex.: drawer aberto). */
  enabled?: boolean
  onNewAppointments?: (items: ProviderAppointmentListRow[]) => void
}

/**
 * Compara IDs entre fetches; na primeira carga não dispara.
 * Novo ID = novo agendamento; mudança só de status não cria novo ID.
 */
export function useNewAppointmentDetector(
  appointments: ProviderAppointmentListRow[],
  options: UseNewAppointmentDetectorOptions = {},
) {
  const { enabled = true, onNewAppointments } = options
  const snapshot = useRef<Set<string> | null>(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (!enabled || !onNewAppointments) return

    const currentIds = new Set(appointments.map((a) => a.id))

    if (isFirst.current) {
      isFirst.current = false
      snapshot.current = currentIds
      return
    }

    const prev = snapshot.current
    snapshot.current = currentIds
    if (!prev) return

    const newcomers = appointments.filter((a) => !prev.has(a.id))
    if (newcomers.length > 0) {
      onNewAppointments(newcomers)
    }
  }, [appointments, enabled, onNewAppointments])
}
