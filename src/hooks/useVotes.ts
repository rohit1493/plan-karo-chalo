import { useCallback, useEffect, useState } from 'react'
import { getVotesByMember } from '../api/votes'

export function useVotes(memberId: string | undefined) {
  const [votedOptionIds, setVotedOptionIds] = useState<Set<string>>(new Set())

  const reload = useCallback(async () => {
    if (!memberId) return
    const ids = await getVotesByMember(memberId)
    setVotedOptionIds(new Set(ids))
  }, [memberId])

  useEffect(() => {
    reload()
  }, [reload])

  const addVote = (optionId: string) =>
    setVotedOptionIds((prev) => new Set([...prev, optionId]))

  const removeVote = (optionId: string) =>
    setVotedOptionIds((prev) => {
      const next = new Set(prev)
      next.delete(optionId)
      return next
    })

  return { votedOptionIds, addVote, removeVote, reload }
}
