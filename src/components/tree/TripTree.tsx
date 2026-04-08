import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Member, StageWithOptions, Trip } from '../../types'
import { computeTreeHealth } from '../../lib/treeHealth'

interface Props {
  trip: Trip
  members: Member[]
  stages: StageWithOptions[]
}

const STATE_CONFIG = {
  seed:    { emoji: '🌱', color: '#F0A500', bg: 'rgba(240, 165, 0, 0.08)',   label: 'Just getting started' },
  sprout:  { emoji: '🌿', color: '#E8601C', bg: 'rgba(232, 96, 28, 0.07)',   label: 'Votes rolling in' },
  healthy: { emoji: '🌳', color: '#C44A12', bg: 'rgba(196, 74, 18, 0.07)',   label: 'Looking great!' },
  wilting: { emoji: '🥀', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.08)',  label: 'Needs a nudge' },
}

export default function TripTree({ trip, members, stages }: Props) {
  const health = useMemo(() => {
    const activeStage = stages.find((s) => s.order === trip.current_stage && !s.is_locked)
    if (!activeStage) return null
    const votedMemberIds = new Set(activeStage.options.flatMap((o) => o.voters.map((v) => v.id)))
    const lastVoteAt = trip.last_vote_at ? new Date(trip.last_vote_at) : null
    return {
      ...computeTreeHealth(members.length, votedMemberIds.size, lastVoteAt, new Date(trip.created_at)),
      voted: votedMemberIds.size,
      total: members.length,
    }
  }, [trip, members, stages])

  if (!health) return null

  const cfg = STATE_CONFIG[health.state]

  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-4"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
      }}
      aria-label="Trip voting progress"
    >
      {/* Emoji pulse */}
      <div
        className={`text-3xl flex-shrink-0 ${health.state === 'healthy' ? 'breathe' : ''}`}
        aria-hidden="true"
      >
        {cfg.emoji}
      </div>

      {/* Text — vote count is the hero */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="text-2xl font-extrabold leading-none"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            {health.voted}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
          >
            of {health.total} voted
          </span>
          <span
            className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: cfg.color,
              background: '#fff',
              border: `1px solid ${cfg.color}35`,
              fontFamily: 'var(--font-body)',
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="rounded-full h-1.5 overflow-hidden"
          style={{ background: 'rgba(18, 13, 9, 0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: cfg.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(health.pct, 4)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {health.state === 'wilting' && (
          <p
            className="text-xs mt-1.5"
            style={{ color: cfg.color, fontFamily: 'var(--font-body)' }}
          >
            No votes in a while — send a nudge!
          </p>
        )}
      </div>
    </div>
  )
}
