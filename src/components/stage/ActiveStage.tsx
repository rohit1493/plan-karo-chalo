import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
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
    if (stage.is_locked) return
    if (pendingVotes.has(optionId)) return

    setPendingVotes((prev) => new Set([...prev, optionId]))
    if ('vibrate' in navigator) navigator.vibrate(40)

    if (votedOptionIds.has(optionId)) {
      onVoteRemoved(optionId)
      try {
        await uncastVote(optionId, currentMember.id)
      } catch {
        onVoteAdded(optionId)
        toast.error('Could not remove vote. Try again.')
      }
    } else {
      onVoteAdded(optionId)
      try {
        await castVote(optionId, currentMember.id)
      } catch {
        onVoteRemoved(optionId)
        toast.error('Could not cast vote. Try again.')
      }
    }

    setPendingVotes((prev) => {
      const next = new Set(prev)
      next.delete(optionId)
      return next
    })
  }

  async function handleDeleteOption(optionId: string) {
    const option = stage.options.find((o) => o.id === optionId)
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-900 text-sm">Remove "{option?.title}"?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deleteOption(optionId)
                  onStageChanged()
                  toast.success('Option removed')
                } catch {
                  toast.error('Could not remove option.')
                }
              }}
              className="flex-1 bg-red-500 text-white text-xs font-semibold py-1.5 rounded-lg"
            >
              Remove
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Stage header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">Active</span>
          <h3
            className="text-base font-bold text-gray-900"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {stageLabel(stage.type)}
          </h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full" aria-live="polite">
          {votedMembersOnStage.size}/{totalMembers} voted
        </span>
      </div>

      {/* Options */}
      <div className="p-4 space-y-3">
        {stage.options.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🗒️</div>
            {isPlanner ? (
              <p className="text-sm text-gray-400">Add the first option below 👇</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 mb-1">Options coming soon!</p>
                <p className="text-xs text-gray-400">
                  The trip organiser will add options here.{'\n'}You'll vote once they're up.
                </p>
              </>
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {stage.options.map((option) => (
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
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Planner actions */}
      {isPlanner && (
        <div className="px-4 pb-4 space-y-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            aria-label="Add a new option to this stage"
            className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600 text-sm font-semibold py-3 rounded-2xl transition-colors"
          >
            + Add Option
          </motion.button>

          {stage.options.length > 0 && (
            <div className="space-y-1.5">
              {stage.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLockOption(opt)}
                  className="w-full text-sm text-gray-600 hover:text-green-700 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 py-2 px-3 rounded-xl transition-colors text-left truncate"
                  title={`Lock "${opt.title}"`}
                >
                  🔒 Lock "{opt.title.length > 32 ? opt.title.slice(0, 32) + '…' : opt.title}"
                </motion.button>
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
