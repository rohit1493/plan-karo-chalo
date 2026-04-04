import type { Member, StageWithOptions, Trip } from '../../types'
import ActiveStage from './ActiveStage'
import LockedStage from './LockedStage'
import UpcomingStage from './UpcomingStage'

interface Props {
  trip: Trip
  stages: StageWithOptions[]
  currentMember: Member
  totalMembers: number
  votedOptionIds: Set<string>
  onVoteAdded: (optionId: string) => void
  onVoteRemoved: (optionId: string) => void
  onStageChanged: () => void
}

export default function StageList({
  trip,
  stages,
  currentMember,
  totalMembers,
  votedOptionIds,
  onVoteAdded,
  onVoteRemoved,
  onStageChanged,
}: Props) {
  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        if (stage.is_locked) {
          return (
            <LockedStage key={stage.id} stage={stage} totalMembers={totalMembers} />
          )
        }
        if (stage.order === trip.current_stage) {
          return (
            <ActiveStage
              key={stage.id}
              stage={stage}
              currentMember={currentMember}
              totalMembers={totalMembers}
              votedOptionIds={votedOptionIds}
              onVoteAdded={onVoteAdded}
              onVoteRemoved={onVoteRemoved}
              onStageChanged={onStageChanged}
            />
          )
        }
        return <UpcomingStage key={stage.id} type={stage.type} />
      })}
    </div>
  )
}
