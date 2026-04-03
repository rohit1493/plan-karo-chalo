import type { Trip } from '../../types'

interface Props {
  trip: Trip
  memberCount: number
}

const stageLabels = ['Dates', 'Location', 'Stay', 'Activities']

export default function TripHeader({ trip, memberCount }: Props) {
  const activeStage = trip.status === 'confirmed' ? 4 : trip.current_stage

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">🌴 {trip.name}</h1>
            <p className="text-sm text-gray-500">{memberCount} {memberCount === 1 ? 'member' : 'members'}</p>
          </div>
          {trip.status === 'confirmed' ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              ✅ Confirmed
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              Stage {activeStage + 1} of 4
            </span>
          )}
        </div>

        {/* Progress bar */}
        {trip.status !== 'confirmed' && (
          <div className="mt-2 flex gap-1">
            {stageLabels.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full ${
                    i < activeStage
                      ? 'bg-green-500'
                      : i === activeStage
                      ? 'bg-green-300'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
