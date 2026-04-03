import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Trip name
        </label>
        <input
          autoFocus
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder="e.g. Goa June 2026"
          maxLength={60}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your name
        </label>
        <input
          type="text"
          value={plannerName}
          onChange={(e) => setPlannerName(e.target.value)}
          placeholder="e.g. Priya"
          maxLength={40}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What do you need to decide first?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFirstStage('date')}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              firstStage === 'date'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">🗓️</div>
            <div className="text-sm font-medium text-gray-900">Pick dates first</div>
            <div className="text-xs text-gray-500 mt-0.5">Then choose a location</div>
          </button>
          <button
            type="button"
            onClick={() => setFirstStage('location')}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              firstStage === 'location'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">🏖️</div>
            <div className="text-sm font-medium text-gray-900">Pick location first</div>
            <div className="text-xs text-gray-500 mt-0.5">Then sort out dates</div>
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!tripName.trim() || !plannerName.trim() || loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
      >
        {loading ? 'Creating trip…' : 'Start Planning 🌴'}
      </button>
    </form>
  )
}
