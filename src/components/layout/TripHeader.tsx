import { motion } from 'framer-motion'
import type { Trip } from '../../types'

interface Props {
  trip: Trip
  memberCount: number
}

const STAGE_LABELS = ['Dates', 'Location', 'Stay', 'Activities']

export default function TripHeader({ trip, memberCount }: Props) {
  const activeStage = trip.status === 'confirmed' ? 4 : trip.current_stage

  return (
    <div className="glass sticky top-0 z-20 px-4 py-3">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1
              className="text-base font-bold text-gray-900 leading-tight truncate"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
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
            <span className="flex-shrink-0 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              Stage {activeStage + 1}/4
            </span>
          )}
        </div>

        {/* Animated progress dots */}
        {trip.status !== 'confirmed' && (
          <div className="mt-2.5 flex gap-1.5 items-center">
            {STAGE_LABELS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1">
                <motion.div
                  className={`h-1.5 rounded-full ${
                    i < activeStage
                      ? 'bg-green-500'
                      : i === activeStage
                      ? 'bg-green-300'
                      : 'bg-gray-200'
                  }`}
                  initial={false}
                  animate={{
                    scaleX: i === activeStage ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <p className={`text-[9px] font-medium text-center truncate ${
                  i < activeStage ? 'text-green-600' : i === activeStage ? 'text-green-400' : 'text-gray-300'
                }`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
