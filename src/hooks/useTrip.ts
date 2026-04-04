import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getTripByCode } from '../api/trips'
import type { Trip } from '../types'

export function useTrip(inviteCode: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!inviteCode) return
    setLoading(true)

    getTripByCode(inviteCode)
      .then((t) => {
        if (!t) setError('Trip not found')
        else setTrip(t)
      })
      .catch(() => setError('Failed to load trip'))
      .finally(() => setLoading(false))
  }, [inviteCode])

  // Realtime: listen for trip updates (status, current_stage)
  useEffect(() => {
    if (!trip?.id) return
    const channel = supabase
      .channel(`trip-${trip.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${trip.id}` },
        (payload) => setTrip(payload.new as Trip)
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [trip?.id])

  return { trip, loading, error }
}
