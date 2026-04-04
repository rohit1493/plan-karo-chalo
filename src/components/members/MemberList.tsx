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
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4
          className="text-sm font-bold text-gray-700"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Members
        </h4>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {votedMemberIds.size}/{members.length} voted
        </span>
      </div>

      {members.length === 1 && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2">
          <span>📤</span>
          <span>Share the trip link so others can join and vote!</span>
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
              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                hasVoted
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
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
                <span title="Organiser" className="text-[10px]">👑</span>
              )}

              {/* Vote status dot */}
              {!hasVoted && (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
              )}
              {hasVoted && (
                <span className="text-green-500 text-[11px] flex-shrink-0">✓</span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
