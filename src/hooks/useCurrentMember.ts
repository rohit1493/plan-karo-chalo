import { useCallback, useEffect, useState } from 'react'
import { getSessionId } from '../lib/session'
import { getMemberBySession } from '../api/members'
import type { Member } from '../types'

export function useCurrentMember(tripId: string | undefined) {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!tripId) return
    const sessionId = getSessionId()
    const m = await getMemberBySession(tripId, sessionId)
    setMember(m)
    setLoading(false)
  }, [tripId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { member, loading, refetch }
}
