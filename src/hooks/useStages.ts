import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { StageWithOptions, OptionWithVotes } from '../types'

async function fetchStages(tripId: string): Promise<StageWithOptions[]> {
  const { data: stages, error } = await supabase
    .from('stages')
    .select(`
      *,
      options (
        *,
        votes ( member_id, members ( id, name ) )
      ),
      locked_option:locked_option_id ( * )
    `)
    .eq('trip_id', tripId)
    .order('order')

  if (error) throw error

  return (stages ?? []).map((stage: any) => ({
    ...stage,
    locked_option: stage.locked_option ?? null,
    options: (stage.options ?? []).map((opt: any) => ({
      ...opt,
      vote_count: opt.votes?.length ?? 0,
      voters: (opt.votes ?? []).map((v: any) => ({ id: v.member_id, name: v.members?.name ?? '?' })),
    })) as OptionWithVotes[],
  })) as StageWithOptions[]
}

export function useStages(tripId: string | undefined) {
  const [stages, setStages] = useState<StageWithOptions[]>([])
  const [loading, setLoading] = useState(true)
  // Debounce ref: batch rapid vote events into one fetch
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reload = useCallback(async () => {
    if (!tripId) return
    try {
      const data = await fetchStages(tripId)
      setStages(data)
    } finally {
      setLoading(false)
    }
  }, [tripId])

  const debouncedReload = useCallback(() => {
    if (!tripId) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      fetchStages(tripId).then(setStages)
    }, 400)
  }, [tripId])

  useEffect(() => {
    reload()
  }, [reload])

  // Realtime: votes on stages in this trip → debounced reload
  // Stages UPDATE (lock event) → immediate reload
  useEffect(() => {
    if (!tripId) return

    const channel = supabase
      .channel(`stages-${tripId}`)
      .on(
        'postgres_changes',
        // Filter votes by stage's trip — Supabase doesn't support join filters,
        // so we listen broadly but debounce to avoid thundering herd
        { event: '*', schema: 'public', table: 'votes' },
        debouncedReload
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'stages', filter: `trip_id=eq.${tripId}` },
        () => {
          // Stage locked — reload immediately (no debounce needed, infrequent)
          fetchStages(tripId).then(setStages)
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'options' },
        debouncedReload
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'options' },
        debouncedReload
      )
      .subscribe()

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      supabase.removeChannel(channel)
    }
  }, [tripId, debouncedReload])

  return { stages, loading, reload }
}
