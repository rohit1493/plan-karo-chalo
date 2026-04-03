import { motion } from 'framer-motion'
import type { Trip, Member, StageWithOptions } from '../../types'
import { shareInviteLink, shareNudgeLink, shareConfirmedLink } from '../../lib/whatsapp'

interface Props {
  trip: Trip
  currentMember: Member | null
  members: { id: string }[]
  votedMemberIds: Set<string>
  stages: StageWithOptions[]
}

export default function BottomBar({ trip, members, votedMemberIds, stages }: Props) {
  const unvotedCount = members.length - votedMemberIds.size

  function getShareLink(): string {
    if (trip.status === 'confirmed') return shareConfirmedLink(trip.name, trip.invite_code, stages)
    if (unvotedCount > 0) return shareNudgeLink(trip.name, trip.invite_code, unvotedCount)
    return shareInviteLink(trip.name, trip.invite_code)
  }

  function getShareLabel(): string {
    if (trip.status === 'confirmed') return '🎉 Share Confirmed Plan'
    if (unvotedCount > 0) return `📣 Nudge ${unvotedCount} to vote`
    return '📤 Invite to WhatsApp'
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
            aria-label={getShareLabel()}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-2xl transition-colors text-white text-[15px] ${
              isConfirmed
                ? 'btn-glow'
                : unvotedCount > 0
                ? 'btn-wa-glow'
                : 'btn-wa-glow'
            }`}
            style={{
              background: isConfirmed
                ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {getShareLabel()}
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
