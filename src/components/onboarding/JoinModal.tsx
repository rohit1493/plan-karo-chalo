import { useState } from 'react'
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
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🌴</div>
          <h2 className="text-xl font-semibold text-gray-900">Join the trip</h2>
          <p className="text-sm text-gray-500 mt-1">{tripName}</p>
        </div>

        <form onSubmit={handleJoin}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            What's your name?
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul"
            maxLength={40}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? 'Joining…' : 'Join Trip'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">No sign-up needed. Just your name.</p>
      </div>
    </div>
  )
}
