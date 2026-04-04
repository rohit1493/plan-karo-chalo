import { supabase } from '../lib/supabase'
import type { Trip } from '../types'

export async function createTrip(
  name: string,
  plannerName: string,
  inviteCode: string,
  sessionId: string,
  firstStage: 'date' | 'location'
): Promise<{ trip_id: string; member_id: string; invite_code: string }> {
  const { data, error } = await supabase.rpc('create_trip', {
    p_name: name,
    p_planner_name: plannerName,
    p_invite_code: inviteCode,
    p_session_id: sessionId,
    p_first_stage: firstStage,
  })
  if (error) throw error
  return data as { trip_id: string; member_id: string; invite_code: string }
}

export async function getTripByCode(inviteCode: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('invite_code', inviteCode)
    .single()
  if (error) return null
  return data as Trip
}
