import { supabase } from '../lib/supabase'

export async function castVote(optionId: string, memberId: string): Promise<void> {
  const { error } = await supabase
    .from('votes')
    .insert({ option_id: optionId, member_id: memberId })
  if (error && error.code !== '23505') throw error // ignore duplicate (already voted)
}

export async function uncastVote(optionId: string, memberId: string): Promise<void> {
  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('option_id', optionId)
    .eq('member_id', memberId)
  if (error) throw error
}

export async function getVotesByMember(memberId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('votes')
    .select('option_id')
    .eq('member_id', memberId)
  if (error) throw error
  return (data ?? []).map((v) => v.option_id as string)
}
