import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { getSessionId } from '../../lib/session'
import { createTrip } from '../../api/trips'

export default function CreateTripForm() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [plannerName, setPlannerName] = useState('')
  const firstStage = 'date' as const
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tripName.trim() || !plannerName.trim()) return
    setLoading(true)
    setError('')
    const sessionId = getSessionId()
    const inviteCode = nanoid(8)
    // Retry up to 3 times — Supabase free tier DB can be cold on first request
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await createTrip(tripName.trim(), plannerName.trim(), inviteCode, sessionId, firstStage)
        navigate(`/trip/${inviteCode}?new=1`)
        return
        // Note: setLoading(false) intentionally omitted — navigate() unmounts the component.
      } catch {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 3000))
        } else {
          setError('Failed to create trip. Please try again.')
          setLoading(false)
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Floating label — Trip name */}
      <div className="float-label-wrapper">
        <input
          autoFocus
          type="text"
          id="tripName"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder=" "
          maxLength={60}
          className="float-label-input"
        />
        <label htmlFor="tripName" className="float-label-text">Trip name (e.g. Goa June 2026)</label>
      </div>

      {/* Floating label — Your name */}
      <div className="float-label-wrapper">
        <input
          type="text"
          id="plannerName"
          value={plannerName}
          onChange={(e) => setPlannerName(e.target.value)}
          placeholder=" "
          maxLength={40}
          className="float-label-input"
        />
        <label htmlFor="plannerName" className="float-label-text">Your name (e.g. Priya)</label>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={!tripName.trim() || !plannerName.trim() || loading}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-colors text-base btn-glow disabled:shadow-none"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            Creating trip…
          </span>
        ) : 'Start Planning 🌴'}
      </motion.button>
    </form>
  )
}
