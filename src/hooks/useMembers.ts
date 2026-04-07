import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getMembers } from '../api/members'
import type { Member } from '../types'

export function useMembers(tripId: string | undefined) {
  const [members, setMembers] = useState<Member[]>([])

  const reload = useCallback(async () => {
    if (!tripId) return
    const data = await getMembers(tripId)
    setMembers(data)
  }, [tripId])

  useEffect(() => {
    if (!tripId) return
    reload()

    const channel = supabase
      .channel(`members-${tripId}`)
      .on(
        'postgres_changes',
        // No server-side filter — client-side check is more reliable across Supabase plans
        { event: 'INSERT', schema: 'public', table: 'members' },
        (payload) => {
          const newMember = payload.new as Member
          if (newMember.trip_id !== tripId) return
          setMembers((prev) => {
            if (prev.some((m) => m.id === newMember.id)) return prev
            return [...prev, newMember]
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'members' },
        (payload) => {
          const updated = payload.new as Member
          if (updated.trip_id !== tripId) return
          setMembers((prev) => prev.map((m) => m.id === updated.id ? updated : m))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [tripId, reload])

  return { members, reload }
}
