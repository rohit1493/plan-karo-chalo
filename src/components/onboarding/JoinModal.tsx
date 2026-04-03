import { useState } from 'react'
import { motion } from 'framer-motion'
import { getSessionId } from '../../lib/session'
import { joinTrip } from '../../api/members'
import type { Member } from '../../types'

interface Props {
  tripId: string
  tripName: string
  onJoined: (member: Member) => void
}

export default function JoinModal({ tripId, tripName, onJoined }: Props) {
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
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Bottom sheet */}
      <motion.div
        className="relative bg-white rounded-t-3xl w-full max-w-lg px-6 pb-8 pt-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      >
        <div className="bottom-sheet-handle" />

        <div className="text-center mb-7">
          <motion.div
            className="text-5xl mb-3"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
          >
            🌴
          </motion.div>
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Join the trip
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{tripName}</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
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
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={!name.trim() || loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-colors btn-glow disabled:shadow-none text-base"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Joining…
              </span>
            ) : 'Join Trip 🎒'}
          </motion.button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">No sign-up needed. Just your name.</p>
      </motion.div>
    </motion.div>
  )
}
