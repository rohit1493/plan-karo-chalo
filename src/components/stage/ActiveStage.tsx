import { useState } from 'react'
import type { Member, StageWithOptions, OptionWithVotes } from '../../types'
import { stageLabel } from '../../lib/whatsapp'
import { castVote, uncastVote } from '../../api/votes'
import { deleteOption } from '../../api/options'
import OptionCard from './OptionCard'
import AddOptionModal from './AddOptionModal'
import LockModal from './LockModal'

interface Props {
  stage: StageWithOptions
  currentMember: Member
  totalMembers: number
  votedOptionIds: Set<string>
  onVoteAdded: (optionId: string) => void
  onVoteRemoved: (optionId: string) => void
  onStageChanged: () => void
}

export default function ActiveStage({
  stage,
  currentMember,
  totalMembers,
  votedOptionIds,
  onVoteAdded,
  onVoteRemoved,
  onStageChanged,
}: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [lockOption, setLockOption] = useState<OptionWithVotes | null>(null)
  const [pendingVotes, setPendingVotes] = useState<Set<string>>(new Set())
  const isPlanner = currentMember.role !== 'contributor'

  const maxVotes = Math.max(...stage.options.map((o) => o.vote_count), 0)
  const votedMembersOnStage = new Set(stage.options.flatMap((o) => o.voters.map((v) => v.id)))

  async function handleToggleVote(optionId: string) {
    // CRITICAL: prevent voting on locked stage (race condition guard)
    if (stage.is_locked) return
    // Prevent double-tap while in flight
    if (pendingVotes.has(optionId)) return

    setPendingVotes((prev) => new Set([...prev, optionId]))
    // Haptic feedback on mobile
    if ('vibrate' in navigator) navigator.vibrate(40)

    if (votedOptionIds.has(optionId)) {
      onVoteRemoved(optionId)
      try {
        await uncastVote(optionId, currentMember.id)
      } catch {
        onVoteAdded(optionId) // rollback optimistic
      }
    } else {
      onVoteAdded(optionId)
      try {
        await castVote(optionId, currentMember.id)
      } catch {
        onVoteRemoved(optionId) // rollback optimistic
      }
    }

    setPendingVotes((prev) => {
      const next = new Set(prev)
      next.delete(optionId)
      return next
    })
  }

  async function handleDeleteOption(optionId: string) {
    if (!confirm('Remove this option?')) return
    try {
      await deleteOption(optionId)
      onStageChanged()
    } catch {
      alert('Could not remove option. Try again.')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Stage header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Active</span>
          <h3 className="text-base font-semibold text-gray-900">{stageLabel(stage.type)}</h3>
        </div>
        <span className="text-xs text-gray-500" aria-live="polite" aria-atomic="true">
          {votedMembersOnStage.size}/{totalMembers} voted
        </span>
      </div>

      {/* Options */}
      <div className="p-4 space-y-3">
        {stage.options.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {isPlanner ? 'Add the first option below 👇' : 'Waiting for options to be added…'}
          </p>
        ) : (
          stage.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              totalMembers={totalMembers}
              isVotedByMe={votedOptionIds.has(option.id)}
              isPending={pendingVotes.has(option.id)}
              isLeading={option.vote_count === maxVotes && maxVotes > 0}
              isLocked={false}
              onToggleVote={handleToggleVote}
              onDelete={isPlanner ? handleDeleteOption : undefined}
              canDelete={isPlanner}
            />
          ))
        )}
      </div>

      {/* Planner actions */}
      {isPlanner && (
        <div className="px-4 pb-4 space-y-2">
          <button
            onClick={() => setShowAddModal(true)}
            aria-label="Add a new option to this stage"
            className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600 text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            + Add Option
          </button>

          {stage.options.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {stage.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLockOption(opt)}
                  className="text-sm text-gray-600 hover:text-green-700 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 py-2 px-3 rounded-lg transition-colors text-left truncate"
                  title={`Lock "${opt.title}"`}
                >
                  🔒 Lock "{opt.title.length > 30 ? opt.title.slice(0, 30) + '…' : opt.title}"
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddOptionModal
          stageId={stage.id}
          memberId={currentMember.id}
          onAdded={onStageChanged}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {lockOption && (
        <LockModal
          stage={stage}
          option={lockOption}
          memberId={currentMember.id}
          onLocked={onStageChanged}
          onClose={() => setLockOption(null)}
        />
      )}
    </div>
  )
}
