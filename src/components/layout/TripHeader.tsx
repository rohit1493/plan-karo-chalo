import { motion } from 'framer-motion'
import type { Trip } from '../../types'

interface Props {
  trip: Trip
  memberCount: number
}

const STAGE_LABELS = ['Dates', 'Location', 'Stay', 'Activities']

export default function TripHeader({ trip, memberCount }: Props) {
  const activeStage = trip.status === 'confirmed' ? 4 : trip.current_stage
  const currentLabel = STAGE_LABELS[activeStage] ?? ''

  return (
    <div className="glass sticky top-0 z-20 px-4 py-3">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight truncate">
              🌴 {trip.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </p>
          </div>

          {trip.status === 'confirmed' ? (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              ✅ Confirmed
            </motion.span>
          ) : (
            <motion.span
              key={activeStage}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Step {activeStage + 1}/4 · {currentLabel}
            </motion.span>
          )}
        </div>

        {/* Progress bar */}
        {trip.status !== 'confirmed' && (
          <div className="mt-2.5 flex gap-1 items-center">
            {STAGE_LABELS.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1 rounded-full flex-1 ${
                  i < activeStage
                    ? 'bg-green-500'
                    : i === activeStage
                    ? 'bg-green-300'
                    : 'bg-gray-200'
                }`}
                initial={false}
                animate={{ scaleX: i === activeStage ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
