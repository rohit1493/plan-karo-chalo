import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { StageWithOptions } from '../../types'
import { stageLabel } from '../../lib/whatsapp'

const STAGE_ICONS: Record<string, string> = {
  date: '📅',
  location: '📍',
  stay: '🏨',
  activity: '🎯',
}

interface Props {
  stages: StageWithOptions[]
}

export default function ConfirmedPlan({ stages }: Props) {
  const lockedStages = stages.filter((s) => s.is_locked)

  useEffect(() => {
    const end = Date.now() + 2000
    const colors = ['#22C55E', '#16A34A', '#FFFFFF', '#4ADE80', '#F0FDF4', '#FCD34D']
    let rafId: number
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors })
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors })
      if (Date.now() < end) rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 22 }}
      className="rounded-3xl overflow-hidden"
      style={{ boxShadow: '0 8px 40px rgba(34,197,94,0.18)' }}
    >
      {/* Gradient header */}
      <div
        className="px-6 py-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1A3A2A 0%, #166534 50%, #15803D 100%)' }}
      >
        <motion.div
          className="text-5xl mb-3"
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h2
          className="text-2xl font-extrabold text-white mb-1"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Trip Confirmed!
        </h2>
        <p className="text-green-200 text-sm">Here's everything you decided together</p>
      </div>

      {/* Decisions */}
      <div className="bg-white divide-y divide-gray-100">
        {lockedStages.map((stage, i) => {
          const locked =
            stage.options.find((o) => o.id === stage.locked_option_id) ??
            (stage.locked_option as any) ??
            null
          if (!locked) return null
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="px-5 py-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-green-100 flex items-center justify-center text-sm">
                  {STAGE_ICONS[stage.type]}
                </div>
                <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">
                  {stageLabel(stage.type)}
                </span>
              </div>
              <p
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {locked.title}
              </p>
              {locked.notes && (
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{locked.notes}</p>
              )}
              {locked.link && (
                <a
                  href={locked.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 mt-1.5 font-medium"
                >
                  🔗 View details
                </a>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-green-50 border-t border-green-100 px-5 py-4 text-center">
        <p className="text-xs text-green-700 font-medium">
          ✨ Share this with your group — everything is decided!
        </p>
      </div>
    </motion.div>
  )
}
