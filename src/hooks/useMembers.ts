import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getMembers } from '../api/members'
import type { Member } from '../types'

export function useMembers(tripId: string | undefined) {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    if (!tripId) return
    getMembers(tripId).then(setMembers)

    const channel = supabase
      .channel(`members-${tripId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'members', filter: `trip_id=eq.${tripId}` },
        (payload) => setMembers((prev) => [...prev, payload.new as Member])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'members', filter: `trip_id=eq.${tripId}` },
        (payload) => setMembers((prev) =>
          prev.map((m) => m.id === payload.new.id ? payload.new as Member : m)
        )
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [tripId])

  return { members }
}
