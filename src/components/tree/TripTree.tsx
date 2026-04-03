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
  seed:    { emoji: '🌱', color: '#86EFAC', label: 'Just planted' },
  sprout:  { emoji: '🌿', color: '#4ADE80', label: 'Growing' },
  healthy: { emoji: '🌳', color: '#22C55E', label: 'Thriving' },
  wilting: { emoji: '🥀', color: '#FBBF24', label: 'Needs attention' },
}

const RADIUS = 28
const CIRC = 2 * Math.PI * RADIUS

export default function TripTree({ trip, members, stages }: Props) {
  const health = useMemo(() => {
    const activeStage = stages.find((s) => s.order === trip.current_stage && !s.is_locked)
    if (!activeStage) return null
    const votedMemberIds = new Set(activeStage.options.flatMap((o) => o.voters.map((v) => v.id)))
    const lastVoteAt = trip.last_vote_at ? new Date(trip.last_vote_at) : null
    return computeTreeHealth(members.length, votedMemberIds.size, lastVoteAt, new Date(trip.created_at))
  }, [trip, members, stages])

  if (!health) return null

  const cfg = STATE_CONFIG[health.state]
  const dashoffset = CIRC - (health.pct / 100) * CIRC

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-4"
      aria-label="Trip health indicator"
      role="region"
    >
      <div className="flex items-center gap-4">
        {/* SVG circular progress ring */}
        <div className="relative flex-shrink-0 w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
            {/* Track */}
            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#F3F4F6" strokeWidth="6" />
            {/* Progress */}
            <motion.circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke={cfg.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: dashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          {/* Emoji center */}
          <div
            className={`absolute inset-0 flex items-center justify-center text-2xl ${
              health.state === 'healthy' ? 'breathe' : ''
            }`}
          >
            {cfg.emoji}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-sm font-bold text-gray-800"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Trip Tree
            </span>
            <span className="text-xs font-semibold" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-gray-500" aria-live="polite">{health.message}</p>
            <span className="text-xs text-gray-400">{health.pct}%</span>
          </div>
          {/* Mini bar */}
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: cfg.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(health.pct, 4)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
