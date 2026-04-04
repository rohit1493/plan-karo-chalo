import { motion } from 'framer-motion'
import type { Trip, StageWithOptions } from '../../types'
import { shareInviteLink, shareNudgeLink, shareConfirmedLink } from '../../lib/whatsapp'

interface Props {
  trip: Trip
  members: { id: string; name: string }[]
  votedMemberIds: Set<string>
  stages: StageWithOptions[]
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

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

export default function BottomBar({ trip, members, votedMemberIds, stages }: Props) {
  const unvotedCount = members.length - votedMemberIds.size
  const hasOptions = stages.some((s) => !s.is_locked && s.options.length > 0)
  const shouldNudge = members.length > 1 && unvotedCount > 0 && hasOptions
  const unvotedMembers = members.filter((m) => !votedMemberIds.has(m.id))

  function getShareLink(): string {
    if (trip.status === 'confirmed') return shareConfirmedLink(trip.name, trip.invite_code, stages)
    if (shouldNudge) return shareNudgeLink(trip.name, trip.invite_code, unvotedCount)
    return shareInviteLink(trip.name, trip.invite_code)
  }

  const isConfirmed = trip.status === 'confirmed'

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-30"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
    >
      <div className="px-4 pb-5 pt-3" style={{ background: 'linear-gradient(to top, rgba(255,251,245,1) 70%, rgba(255,251,245,0))' }}>
        <div className="max-w-lg mx-auto">
          <motion.a
            href={getShareLink()}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 w-full font-bold py-3.5 rounded-2xl transition-colors text-white text-[15px]"
            style={{
              background: isConfirmed
                ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            }}
          >
            {isConfirmed ? (
              <>🎉 Share Confirmed Plan</>
            ) : shouldNudge ? (
              <>
                {/* Unvoted member avatar chips */}
                <span className="flex items-center -space-x-1.5">
                  {unvotedMembers.slice(0, 3).map((m) => (
                    <span
                      key={m.id}
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor(m.name) }}
                    >
                      {initials(m.name)}
                    </span>
                  ))}
                </span>
                <span>Nudge {unvotedCount} to vote →</span>
              </>
            ) : members.length > 1 ? (
              <>📤 Share Trip Link</>
            ) : (
              <>📤 Invite Friends to WhatsApp</>
            )}
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
