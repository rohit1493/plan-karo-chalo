import type { TreeHealth } from '../types'

const INACTIVITY_MS = 48 * 60 * 60 * 1000 // 48 hours

export function computeTreeHealth(
  totalMembers: number,
  membersVotedCount: number,
  lastVoteAt: Date | null,
  tripCreatedAt: Date
): TreeHealth {
  const now = Date.now()
  const pct = totalMembers > 0 ? Math.round((membersVotedCount / totalMembers) * 100) : 0

  const lastActivity = lastVoteAt?.getTime() ?? tripCreatedAt.getTime()
  const isInactive = now - lastActivity > INACTIVITY_MS
  const unvoted = totalMembers - membersVotedCount

  if (isInactive && pct < 60) {
    return {
      state: 'wilting',
      pct,
      message: `Your tree is wilting 🥀 — ${unvoted} ${unvoted === 1 ? 'person hasn\'t' : 'people haven\'t'} voted yet!`,
    }
  }
  if (pct >= 60) {
    return {
      state: 'healthy',
      pct,
      message: `Your trip tree is thriving! ${membersVotedCount}/${totalMembers} members have voted.`,
    }
  }
  if (pct >= 30) {
    return {
      state: 'sprout',
      pct,
      message: `Your trip is sprouting! Keep the momentum going.`,
    }
  }
  return {
    state: 'seed',
    pct,
    message: `A new adventure is planted! Water it with your votes.`,
  }
}
