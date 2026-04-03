import { useState } from 'react'
import { addOption } from '../../api/options'

interface Props {
  stageId: string
  memberId: string
  onAdded: () => void
  onClose: () => void
}

export default function AddOptionModal({ stageId, memberId, onAdded, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function isValidUrl(url: string): boolean {
    if (!url.trim()) return true // optional field
    try {
      const p = new URL(url.trim())
      return p.protocol === 'http:' || p.protocol === 'https:'
    } catch { return false }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (link.trim() && !isValidUrl(link)) {
      setError('Link must be a valid URL starting with http:// or https://')
      return
    }
    setLoading(true)
    setError('')
    try {
      await addOption(stageId, title.trim(), memberId, link.trim() || undefined, notes.trim() || undefined)
      onAdded()
      onClose()
    } catch {
      setError('Failed to add option. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Add an option</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zostel Anjuna"
              maxLength={100}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. ₹800/night, pool, near beach"
              maxLength={200}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? 'Adding…' : 'Add Option'}
          </button>
        </form>
      </div>
    </div>
  )
}
