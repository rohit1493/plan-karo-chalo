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
  const [firstStage, setFirstStage] = useState<'date' | 'location'>('date')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tripName.trim() || !plannerName.trim()) return
    setLoading(true)
    setError('')
    try {
      const sessionId = getSessionId()
      const inviteCode = nanoid(8)
      await createTrip(tripName.trim(), plannerName.trim(), inviteCode, sessionId, firstStage)
      navigate(`/trip/${inviteCode}`)
    } catch {
      setError('Failed to create trip. Please try again.')
      setLoading(false)
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

      {/* Stage picker */}
      <div>
        <p
          className="text-sm font-medium mb-3"
          style={{ color: '#4A3D33', fontFamily: 'var(--font-body)' }}
        >
          What do you need to decide first?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { val: 'date' as const, icon: '🗓️', title: 'Pick dates first', sub: 'Then choose a location' },
            { val: 'location' as const, icon: '🏖️', title: 'Pick location first', sub: 'Then sort out dates' },
          ]).map((opt) => (
            <motion.button
              key={opt.val}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setFirstStage(opt.val)}
              className="p-4 rounded-2xl border-2 text-left transition-all"
              style={{
                borderColor: firstStage === opt.val ? '#E8601C' : '#E5DDD2',
                background: firstStage === opt.val ? 'rgba(232, 96, 28, 0.06)' : '#FFFFFF',
              }}
            >
              <div className="text-2xl mb-1.5" aria-hidden="true">{opt.icon}</div>
              <div
                className="text-sm font-semibold"
                style={{ color: '#120D09', fontFamily: 'var(--font-body)' }}
              >
                {opt.title}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
              >
                {opt.sub}
              </div>
              {firstStage === opt.val && (
                <div
                  className="mt-2 w-5 h-5 rounded-full flex items-center justify-center ml-auto"
                  style={{ background: '#E8601C' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={!tripName.trim() || !plannerName.trim() || loading}
        whileTap={{ scale: 0.97 }}
        className="w-full text-white font-bold py-4 rounded-2xl transition-colors text-base btn-glow disabled:shadow-none"
        style={{
          background:
            !tripName.trim() || !plannerName.trim() || loading
              ? '#E5DDD2'
              : '#E8601C',
          color:
            !tripName.trim() || !plannerName.trim() || loading
              ? '#9B8F82'
              : '#FFFFFF',
          fontFamily: 'var(--font-display)',
        }}
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
