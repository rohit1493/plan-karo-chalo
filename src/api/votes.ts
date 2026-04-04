import { supabase } from '../lib/supabase'

export async function castVote(optionId: string, memberId: string): Promise<void> {
  // Use RPC to bypass any broken RLS policies on the votes table
  const { data, error } = await supabase.rpc('cast_vote', {
    p_option_id: optionId,
    p_member_id: memberId,
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
}

export async function uncastVote(optionId: string, memberId: string): Promise<void> {
  const { data, error } = await supabase.rpc('uncast_vote', {
    p_option_id: optionId,
    p_member_id: memberId,
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
}

export async function getVotesByMember(memberId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('votes')
    .select('option_id')
    .eq('member_id', memberId)
  if (error) throw error
  return (data ?? []).map((v) => v.option_id as string)
}
