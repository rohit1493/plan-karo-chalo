import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { OptionWithVotes, StageWithOptions } from '../../types'
import { stageLabel } from '../../lib/whatsapp'

interface Props {
  stage: StageWithOptions
  option: OptionWithVotes
  memberId: string
  onLocked: () => void
  onClose: () => void
}

export default function LockModal({ stage, option, memberId, onLocked, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!locked) return
    const end = Date.now() + 1200
    const colors = ['#E8601C', '#F0A500', '#C44A12', '#FFFFFF', '#FFF5EE']
    let rafId: number
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    const timer = setTimeout(() => { onLocked(); onClose() }, 1400)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [locked]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLock() {
    setLoading(true)
    try {
      const { error: fnError } = await supabase.functions.invoke('lock-stage', {
        body: { stageId: stage.id, optionId: option.id, memberId },
      })
      if (fnError) throw fnError
      setLocked(true)
      toast.success(`🔒 ${stageLabel(stage.type)} locked!`, { duration: 2000 })
    } catch {
      toast.error('Failed to lock. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(18, 13, 9, 0.6)' }}
        onClick={!loading ? onClose : undefined}
      />
      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl px-6 pb-8 pt-4"
        style={{ background: 'var(--color-paper)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      >
        <div className="bottom-sheet-handle" />
        <div className="text-center mb-6">
          <motion.div
            className="text-5xl mb-3"
            animate={locked ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.3, 1.2] } : {}}
            transition={{ duration: 0.5 }}
          >
            {locked ? '🎉' : '🔒'}
          </motion.div>
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            {locked ? 'Decision locked!' : 'Lock this decision?'}
          </h3>
          {!locked && (
            <p
              className="text-sm mt-1.5 leading-relaxed"
              style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            >
              Lock{' '}
              <span className="font-semibold" style={{ color: '#120D09' }}>"{option.title}"</span>
              {' '}as the final choice for{' '}
              <span className="font-semibold" style={{ color: '#120D09' }}>{stageLabel(stage.type)}</span>?
            </p>
          )}
        </div>

        {!locked && (
          <>
            <div
              className="rounded-2xl p-3.5 mb-5 flex gap-2.5 items-start"
              style={{
                background: 'rgba(240, 165, 0, 0.1)',
                border: '1px solid rgba(240, 165, 0, 0.3)',
              }}
            >
              <span className="text-lg flex-shrink-0" aria-hidden="true">⚠️</span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#7A5C00', fontFamily: 'var(--font-body)' }}
              >
                This cannot be undone. Voting will close and the stage becomes read-only.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 border-2 font-semibold py-3.5 rounded-2xl transition-colors"
                style={{
                  borderColor: '#E5DDD2',
                  color: '#4A3D33',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLock}
                disabled={loading}
                className="flex-1 text-white font-bold py-3.5 rounded-2xl btn-glow disabled:shadow-none transition-colors"
                style={{
                  background: loading ? '#E5DDD2' : '#E8601C',
                  color: loading ? '#9B8F82' : '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                    Locking…
                  </span>
                ) : '🔒 Lock It'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
