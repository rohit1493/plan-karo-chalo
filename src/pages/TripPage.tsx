import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrip'
import { useCurrentMember } from '../hooks/useCurrentMember'
import { useMembers } from '../hooks/useMembers'
import { useStages } from '../hooks/useStages'
import { useVotes } from '../hooks/useVotes'
import { useOnline } from '../hooks/useOnline'
import TripHeader from '../components/layout/TripHeader'
import BottomBar from '../components/layout/BottomBar'
import OfflineBanner from '../components/layout/OfflineBanner'
import JoinModal from '../components/onboarding/JoinModal'
import StageList from '../components/stage/StageList'
import TripTree from '../components/tree/TripTree'
import MemberList from '../components/members/MemberList'
import ConfirmedPlan from '../components/confirmed/ConfirmedPlan'
import type { Member } from '../types'

export default function TripPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>()
  const { trip, loading: tripLoading, error: tripError } = useTrip(inviteCode)
  const { member, loading: memberLoading, refetch: refetchMember } = useCurrentMember(trip?.id)
  const { members } = useMembers(trip?.id)
  const { stages, reload: reloadStages } = useStages(trip?.id)
  const { votedOptionIds, addVote, removeVote, reload: reloadVotes } = useVotes(member?.id)
  const isOnline = useOnline()

  const votedMemberIdsOnActiveStage = useMemo(() => {
    const activeStage = stages.find((s) => s.order === (trip?.current_stage ?? 0) && !s.is_locked)
    return new Set((activeStage?.options ?? []).flatMap((o) => o.voters.map((v) => v.id)))
  }, [stages, trip?.current_stage])

  function handleJoined(_newMember: Member) {
    refetchMember()
    reloadVotes()
  }

  function handleStageChanged() {
    reloadStages()
    reloadVotes()
  }

  if (tripLoading || memberLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]" role="status" aria-label="Loading trip">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse" aria-hidden="true">🌴</div>
          <p className="text-gray-500 text-sm">Loading trip…</p>
        </div>
      </div>
    )
  }

  if (tripError || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4" role="main">
        <div className="text-center max-w-xs">
          <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Trip not found</h2>
          <p className="text-sm text-gray-500">This link may have expired or the trip doesn't exist.</p>
          <a href="/" className="mt-4 inline-block text-green-600 text-sm font-medium">
            Start a new trip →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      {!isOnline && <OfflineBanner />}

      <TripHeader trip={trip} memberCount={members.length} />

      <main id="main-content" className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4 pb-24">
        {trip.status === 'confirmed' ? (
          <ConfirmedPlan stages={stages} />
        ) : member ? (
          <>
            <TripTree trip={trip} members={members} stages={stages} />
            <StageList
              trip={trip}
              stages={stages}
              currentMember={member}
              totalMembers={members.length}
              votedOptionIds={votedOptionIds}
              onVoteAdded={addVote}
              onVoteRemoved={removeVote}
              onStageChanged={handleStageChanged}
            />
            <MemberList members={members} stages={stages} trip={trip} />
          </>
        ) : null}
      </main>

      {member && (
        <BottomBar
          trip={trip}
          currentMember={member}
          members={members}
          votedMemberIds={votedMemberIdsOnActiveStage}
          stages={stages}
        />
      )}

      {!member && !memberLoading && (
        <JoinModal
          tripId={trip.id}
          tripName={trip.name}
          onJoined={handleJoined}
        />
      )}
    </div>
  )
}
