import { supabase } from '../lib/supabase'
import type { Option } from '../types'

export async function addOption(
  stageId: string,
  title: string,
  memberId: string,
  link?: string,
  notes?: string
): Promise<Option> {
  const { data, error } = await supabase
    .from('options')
    .insert({ stage_id: stageId, title, link: link || null, notes: notes || null, added_by: memberId })
    .select()
    .single()
  if (error) throw error
  return data as Option
}

export async function deleteOption(optionId: string): Promise<void> {
  const { error } = await supabase.from('options').delete().eq('id', optionId)
  if (error) throw error
}
