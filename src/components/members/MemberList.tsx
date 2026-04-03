import type { Member, StageWithOptions, Trip } from '../../types'

interface Props {
  members: Member[]
  stages: StageWithOptions[]
  trip: Trip
}

export default function MemberList({ members, stages, trip }: Props) {
  const activeStage = stages.find((s) => s.order === trip.current_stage && !s.is_locked)
  const votedMemberIds = new Set(
    (activeStage?.options ?? []).flatMap((o) => o.voters.map((v) => v.id))
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Members</h4>
        <span className="text-xs text-gray-400">
          {votedMemberIds.size}/{members.length} voted
        </span>
      </div>
      {members.length === 1 && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
          📤 Share the trip link so others can join and vote!
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {members.map((m) => {
          const hasVoted = votedMemberIds.has(m.id)
          return (
            <div
              key={m.id}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border ${
                hasVoted
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  hasVoted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              {m.name}
              {m.role !== 'contributor' && (
                <span className="text-[10px] text-gray-400">(org)</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
