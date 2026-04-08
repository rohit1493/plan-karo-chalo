import { useEffect } from 'react'
import { motion } from 'framer-motion'

function isSafeUrl(url: string): boolean {
  try {
    const p = new URL(url)
    return p.protocol === 'http:' || p.protocol === 'https:'
  } catch { return false }
}
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
    const colors = ['#E8601C', '#F0A500', '#C44A12', '#FFFFFF', '#FFF5EE', '#1D7575']
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
      style={{ boxShadow: '0 8px 40px rgba(232, 96, 28, 0.14)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #120D09 0%, #1E1208 50%, #2A1A0C 100%)' }}
      >
        {/* Dot grid decoration */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-32 h-32 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0A500 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />

        <motion.div
          className="text-5xl mb-3 relative z-10"
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h2
          className="text-2xl font-extrabold text-white mb-1 relative z-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Trip Confirmed!
        </h2>
        <p
          className="text-sm relative z-10"
          style={{ color: 'rgba(240, 165, 0, 0.75)', fontFamily: 'var(--font-body)' }}
        >
          Here's everything you decided together
        </p>
      </div>

      {/* Decisions */}
      <div
        className="divide-y"
        style={{ background: '#FFFFFF', borderColor: 'rgba(18, 13, 9, 0.06)' }}
      >
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
              style={{ borderColor: 'rgba(18, 13, 9, 0.06)' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'rgba(232, 96, 28, 0.1)' }}
                >
                  {STAGE_ICONS[stage.type]}
                </div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: '#E8601C', fontFamily: 'var(--font-body)' }}
                >
                  {stageLabel(stage.type)}
                </span>
              </div>
              <p
                className="text-base font-bold"
                style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
              >
                {locked.title}
              </p>
              {locked.notes && (
                <p
                  className="text-sm mt-0.5 leading-relaxed"
                  style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
                >
                  {locked.notes}
                </p>
              )}
              {locked.link && isSafeUrl(locked.link) && (
                <a
                  href={locked.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm mt-1.5 font-medium hover:underline"
                  style={{ color: '#1D7575' }}
                >
                  🔗 View details
                </a>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-4 text-center"
        style={{
          background: 'rgba(232, 96, 28, 0.05)',
          borderTop: '1px solid rgba(232, 96, 28, 0.12)',
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: '#8B3A10', fontFamily: 'var(--font-body)' }}
        >
          ✨ Share this with your group — everything is decided!
        </p>
      </div>
    </motion.div>
  )
}
