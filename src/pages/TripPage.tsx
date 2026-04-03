import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

function SkeletonBlock({ h = 'h-24' }: { h?: string }) {
  return <div className={`skeleton ${h} w-full`} />
}

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
      <motion.div
        className="min-h-screen bg-[#FFFBF5] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Skeleton header */}
        <div className="glass sticky top-0 z-10 px-4 py-3 border-b border-gray-100">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="space-y-2">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-3 w-20" />
            </div>
            <div className="skeleton h-6 w-16" />
          </div>
        </div>
        <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4">
          <SkeletonBlock h="h-20" />
          <SkeletonBlock h="h-48" />
          <SkeletonBlock h="h-32" />
          <SkeletonBlock h="h-16" />
        </div>
      </motion.div>
    )
  }

  if (tripError || !trip) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="main"
      >
        <div className="text-center max-w-xs">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Trip not found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            This link may have expired or the trip doesn't exist.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 bg-green-600 text-white font-semibold px-5 py-3 rounded-xl btn-glow text-sm"
          >
            Start a new trip →
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-[#FFFBF5] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence>
        {!isOnline && <OfflineBanner key="offline" />}
      </AnimatePresence>

      <TripHeader trip={trip} memberCount={members.length} />

      <main id="main-content" className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4 pb-28">
        <AnimatePresence mode="wait">
          {trip.status === 'confirmed' ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ConfirmedPlan stages={stages} />
            </motion.div>
          ) : member ? (
            <motion.div
              key="planning"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
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
            </motion.div>
          ) : null}
        </AnimatePresence>
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

      <AnimatePresence>
        {!member && !memberLoading && (
          <JoinModal
            key="join"
            tripId={trip.id}
            tripName={trip.name}
            onJoined={handleJoined}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
