import type { Trip, Member, StageWithOptions } from '../../types'
import { shareInviteLink, shareNudgeLink, shareConfirmedLink } from '../../lib/whatsapp'

interface Props {
  trip: Trip
  currentMember: Member | null
  members: { id: string }[]
  votedMemberIds: Set<string>  // members who voted on current active stage
  stages: StageWithOptions[]
}

export default function BottomBar({ trip, members, votedMemberIds, stages }: Props) {
  const unvotedCount = members.length - votedMemberIds.size

  function getShareLink(): string {
    if (trip.status === 'confirmed') {
      return shareConfirmedLink(trip.name, trip.invite_code, stages)
    }
    if (unvotedCount > 0) {
      return shareNudgeLink(trip.name, trip.invite_code, unvotedCount)
    }
    return shareInviteLink(trip.name, trip.invite_code)
  }

  function getShareLabel(): string {
    if (trip.status === 'confirmed') return '🎉 Share Confirmed Plan'
    if (unvotedCount > 0) return `📣 Nudge ${unvotedCount} people to vote`
    return '📤 Invite to WhatsApp'
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-pb">
      <div className="max-w-lg mx-auto">
        <a
          href={getShareLink()}
          aria-label={getShareLabel()}
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {getShareLabel()}
        </a>
      </div>
    </div>
  )
}
