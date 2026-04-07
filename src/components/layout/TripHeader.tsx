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
              className="text-base font-bold leading-tight truncate"
              style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
            >
              🌴 {trip.name}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}>
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </p>
          </div>

          {trip.status === 'confirmed' ? (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(29, 117, 117, 0.12)',
                color: '#1D7575',
                border: '1px solid rgba(29, 117, 117, 0.25)',
                fontFamily: 'var(--font-body)',
              }}
            >
              ✅ Confirmed
            </motion.span>
          ) : (
            <span
              className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(18, 13, 9, 0.07)',
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Stage {activeStage + 1}/4
            </span>
          )}
        </div>

        {/* Animated progress segments */}
        {trip.status !== 'confirmed' && (
          <div className="mt-2.5 flex gap-1.5 items-center">
            {STAGE_LABELS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1">
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{
                    background:
                      i < activeStage
                        ? '#E8601C'
                        : i === activeStage
                        ? '#F0A500'
                        : 'rgba(18, 13, 9, 0.12)',
                  }}
                  initial={false}
                  animate={{
                    scaleX: i === activeStage ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <p
                  className="text-[9px] font-medium text-center truncate"
                  style={{
                    color:
                      i < activeStage
                        ? '#E8601C'
                        : i === activeStage
                        ? '#F0A500'
                        : 'rgba(18, 13, 9, 0.25)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
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
