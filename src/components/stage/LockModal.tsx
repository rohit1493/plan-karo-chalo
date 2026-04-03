import { useState } from 'react'
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
  const [error, setError] = useState('')

  async function handleLock() {
    setLoading(true)
    setError('')
    try {
      const { error: fnError } = await supabase.functions.invoke('lock-stage', {
        body: { stageId: stage.id, optionId: option.id, memberId },
      })
      if (fnError) throw fnError
      onLocked()
      onClose()
    } catch {
      setError('Failed to lock. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900">Lock this decision?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Lock <span className="font-medium text-gray-800">"{option.title}"</span> as the final choice for{' '}
            <span className="font-medium text-gray-800">{stageLabel(stage.type)}</span>?
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
          This cannot be undone. The stage will become read-only and voting will close.
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLock}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            {loading ? 'Locking…' : '🔒 Lock It'}
          </button>
        </div>
      </div>
    </div>
  )
}
