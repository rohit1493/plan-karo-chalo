import { useMemo } from 'react'
import type { Member, StageWithOptions, Trip } from '../../types'
import { computeTreeHealth } from '../../lib/treeHealth'

const TREE_EMOJI: Record<string, string> = {
  seed: '🌱',
  sprout: '🌿',
  healthy: '🌳',
  wilting: '🥀',
}

interface Props {
  trip: Trip
  members: Member[]
  stages: StageWithOptions[]
}

export default function TripTree({ trip, members, stages }: Props) {
  const health = useMemo(() => {
    const activeStage = stages.find((s) => s.order === trip.current_stage && !s.is_locked)
    if (!activeStage) return null

    const votedMemberIds = new Set(activeStage.options.flatMap((o) => o.voters.map((v) => v.id)))
    // Use accurate last_vote_at from DB trigger (set on every vote insert/delete)
    const lastVoteAt = trip.last_vote_at ? new Date(trip.last_vote_at) : null

    return computeTreeHealth(
      members.length,
      votedMemberIds.size,
      lastVoteAt,
      new Date(trip.created_at)
    )
  }, [trip, members, stages])

  if (!health) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4" aria-label="Trip health indicator" role="region">
      <div className="flex items-center gap-3">
        <div className="text-4xl">{TREE_EMOJI[health.state]}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Trip Tree</span>
            <span className="text-xs text-gray-500">{health.pct}% active</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                health.state === 'wilting'
                  ? 'bg-yellow-400'
                  : health.state === 'healthy'
                  ? 'bg-green-500'
                  : 'bg-green-300'
              }`}
              style={{ width: `${Math.max(health.pct, 4)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5" aria-live="polite">{health.message}</p>
        </div>
      </div>
    </div>
  )
}
