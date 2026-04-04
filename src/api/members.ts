import { supabase } from '../lib/supabase'
import type { Member, MemberRole } from '../types'

export async function joinTrip(
  tripId: string,
  name: string,
  sessionId: string,
  role: MemberRole = 'contributor'
): Promise<Member> {
  // Try insert first
  const { data, error } = await supabase
    .from('members')
    .upsert(
      { trip_id: tripId, name, session_id: sessionId, role },
      { onConflict: 'trip_id,session_id', ignoreDuplicates: true }
    )
    .select()
    .maybeSingle()

  // If upsert returned nothing (duplicate row existed), fetch the existing member
  if (!data) {
    const existing = await getMemberBySession(tripId, sessionId)
    if (existing) return existing
    if (error) throw error
  }

  return data as Member
}

export async function getMemberBySession(tripId: string, sessionId: string): Promise<Member | null> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('trip_id', tripId)
    .eq('session_id', sessionId)
    .single()
  return (data as Member) ?? null
}

export async function getMembers(tripId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('trip_id', tripId)
    .order('joined_at')
  if (error) throw error
  return (data as Member[]) ?? []
}
