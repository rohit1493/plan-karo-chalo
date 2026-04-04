import { useState, useEffect, useRef } from 'react'
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
  totalMembers: number
  onLocked: () => void
  onClose: () => void
}

export default function LockModal({ stage, option, memberId, totalMembers, onLocked, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [confirmReady, setConfirmReady] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    timerRef.current = setTimeout(() => setConfirmReady(true), 800)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const onLockedRef = useRef(onLocked)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onLockedRef.current = onLocked }, [onLocked])
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!locked) return
    const end = Date.now() + 1200
    const colors = ['#22C55E', '#16A34A', '#4ADE80', '#FFFFFF', '#F0FDF4']
    let rafId: number
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    const timer = setTimeout(() => { onLockedRef.current(); onCloseRef.current() }, 1400)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [locked])

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
      <motion.div className="absolute inset-0 bg-black/50" onClick={!loading ? onClose : undefined} />
      <motion.div
        className="relative bg-white rounded-t-3xl w-full max-w-lg px-6 pb-8 pt-4"
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
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {locked ? 'Decision locked!' : 'Lock this decision?'}
          </h3>
          {!locked && (
            <>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Lock{' '}
                <span className="font-semibold text-gray-800">"{option.title}"</span>
                {' '}as the final choice for{' '}
                <span className="font-semibold text-gray-800">{stageLabel(stage.type)}</span>?
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                ✓ Won with {option.vote_count} of {totalMembers} vote{totalMembers !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>

        {!locked && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex gap-2.5 items-start">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <p className="text-sm text-amber-800 leading-relaxed">
                This cannot be undone. Voting will close and the stage becomes read-only.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={confirmReady && !loading ? { scale: 0.97 } : {}}
                onClick={handleLock}
                disabled={loading || !confirmReady}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-400 text-white font-bold py-3.5 rounded-2xl btn-glow disabled:shadow-none transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                    Locking…
                  </span>
                ) : !confirmReady ? 'Hold on…' : '🔒 Lock It'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
