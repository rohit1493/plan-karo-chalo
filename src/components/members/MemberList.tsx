import { motion } from 'framer-motion'
import type { Member, StageWithOptions, Trip } from '../../types'

interface Props {
  members: Member[]
  stages: StageWithOptions[]
  trip: Trip
}

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#F97316', '#14B8A6', '#6366F1', '#F43F5E',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function MemberList({ members, stages, trip }: Props) {
  const activeStage = stages.find((s) => s.order === trip.current_stage && !s.is_locked)
  const votedMemberIds = new Set(
    (activeStage?.options ?? []).flatMap((o) => o.voters.map((v) => v.id))
  )

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(18, 13, 9, 0.08)',
        boxShadow: '0 2px 8px rgba(18, 13, 9, 0.04)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4
          className="text-sm font-bold"
          style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
        >
          Members
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(18, 13, 9, 0.07)',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {votedMemberIds.size}/{members.length} voted
        </span>
      </div>

      {members.length === 1 && (
        <div
          className="rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2"
          style={{
            background: 'rgba(240, 165, 0, 0.1)',
            border: '1px solid rgba(240, 165, 0, 0.3)',
          }}
        >
          <span aria-hidden="true">📤</span>
          <span
            className="text-xs"
            style={{ color: '#7A5C00', fontFamily: 'var(--font-body)' }}
          >
            Share the trip link so others can join and vote!
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {members.map((m, i) => {
          const hasVoted = votedMemberIds.has(m.id)
          const isOrganiser = m.role !== 'contributor'
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              title={`${m.name}${isOrganiser ? ' (organiser)' : ''}${hasVoted ? ' — voted' : ' — not voted yet'}`}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-full border transition-all"
              style={{
                background: hasVoted ? 'rgba(232, 96, 28, 0.07)' : 'rgba(18, 13, 9, 0.04)',
                borderColor: hasVoted ? 'rgba(232, 96, 28, 0.25)' : 'rgba(18, 13, 9, 0.1)',
                color: hasVoted ? '#8B3A10' : '#4A3D33',
                fontFamily: 'var(--font-body)',
              }}
            >
              {/* Mini avatar */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(m.name) }}
              >
                {initials(m.name)}
              </div>

              <span className="font-medium">{m.name}</span>

              {isOrganiser && (
                <span title="Organiser" className="text-[10px]" aria-label="organiser">👑</span>
              )}

              {/* Vote status dot */}
              {!hasVoted && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(18, 13, 9, 0.2)' }}
                />
              )}
              {hasVoted && (
                <span
                  className="text-[11px] flex-shrink-0"
                  style={{ color: '#E8601C' }}
                >
                  ✓
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
