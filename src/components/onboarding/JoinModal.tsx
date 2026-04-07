import { useState } from 'react'
import { motion } from 'framer-motion'
import { getSessionId } from '../../lib/session'
import { joinTrip } from '../../api/members'
import type { Member } from '../../types'

interface Props {
  tripId: string
  tripName: string
  memberCount: number
  onJoined: (member: Member) => void
}

export default function JoinModal({ tripId, tripName, memberCount, onJoined }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    try {
      const sessionId = getSessionId()
      const member = await joinTrip(tripId, trimmed, sessionId)
      onJoined(member)
    } catch {
      setError('Something went wrong. Please try again.')
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
      {/* Backdrop */}
      <motion.div className="absolute inset-0" style={{ background: 'rgba(18, 13, 9, 0.72)' }} />

      {/* Bottom sheet */}
      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl px-6 pb-10 pt-4 overflow-hidden"
        style={{ background: 'var(--color-paper)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      >
        {/* Decorative dot grid in header */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-36 h-36 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #E8601C 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="bottom-sheet-handle" />

        {/* Header */}
        <div className="text-center mb-7 relative z-10">
          <motion.div
            className="text-5xl mb-3"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
          >
            🌴
          </motion.div>

          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: '#E8601C', fontFamily: 'var(--font-body)' }}
          >
            You're invited!
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            {tripName}
          </h2>

          {memberCount > 0 && (
            <p
              className="text-sm mt-2"
              style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            >
              {memberCount === 1
                ? '1 person is planning this trip'
                : `${memberCount} people are planning this trip`}
              {' '}— join them! 🎒
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="space-y-4 relative z-10">
          <div className="float-label-wrapper">
            <input
              autoFocus
              type="text"
              id="joinName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              maxLength={40}
              className="float-label-input"
            />
            <label htmlFor="joinName" className="float-label-text">Your name (e.g. Rahul)</label>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={!name.trim() || loading}
            whileTap={{ scale: 0.97 }}
            className="w-full text-white font-bold py-4 rounded-2xl transition-colors btn-glow disabled:shadow-none text-base"
            style={{
              background: !name.trim() || loading ? '#E5DDD2' : '#E8601C',
              color: !name.trim() || loading ? '#9B8F82' : '#FFFFFF',
              fontFamily: 'var(--font-display)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Joining…
              </span>
            ) : 'Join & Vote 🗳️'}
          </motion.button>
        </form>

        <p
          className="text-xs text-center mt-4 relative z-10"
          style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
        >
          No sign-up needed. Just your name to vote.
        </p>
      </motion.div>
    </motion.div>
  )
}
