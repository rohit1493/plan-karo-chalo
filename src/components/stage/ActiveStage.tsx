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

  const maxVotes = stage.options.length > 0
    ? Math.max(...stage.options.map((o) => o.vote_count), 0)
    : 0
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
    const title = stage.options.find((o) => o.id === optionId)?.title ?? 'this option'
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p
            className="font-medium text-sm"
            style={{ color: '#120D09', fontFamily: 'var(--font-body)' }}
          >
            Remove &quot;{title}&quot;?
          </p>
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
              className="flex-1 text-white text-xs font-semibold py-1.5 rounded-lg"
              style={{ background: '#E8601C' }}
            >
              Remove
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 text-xs font-semibold py-1.5 rounded-lg"
              style={{ background: 'rgba(18, 13, 9, 0.07)', color: '#4A3D33' }}
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
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(232, 96, 28, 0.18)',
        boxShadow: '0 2px 12px rgba(18, 13, 9, 0.06)',
      }}
    >
      {/* Stage header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(18, 13, 9, 0.07)' }}
      >
        <div>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: '#E8601C', fontFamily: 'var(--font-body)' }}
          >
            Active
          </span>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            {stageLabel(stage.type)}
          </h3>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(18, 13, 9, 0.07)',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-body)',
          }}
          aria-live="polite"
        >
          {votedMembersOnStage.size}/{totalMembers} voted
        </span>
      </div>

      {/* Options */}
      <div className="p-4 space-y-3">
        {stage.options.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3" aria-hidden="true">{stage.type === 'date' ? '📅' : '🗒️'}</div>
            {isPlanner ? (
              <p
                className="text-sm"
                style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
              >
                {stage.type === 'date' ? 'Tap below to pick date ranges 👇' : 'Add the first option below 👇'}
              </p>
            ) : (
              <>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#4A3D33', fontFamily: 'var(--font-body)' }}
                >
                  Options coming soon!
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
                >
                  The trip organiser will add options here. You&apos;ll vote once they&apos;re up.
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: '#F0A500', fontFamily: 'var(--font-body)' }}
                >
                  Created the trip? Open it in your original browser to manage options.
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
            className="w-full border-2 border-dashed text-sm font-semibold py-3 rounded-2xl transition-colors"
            style={{
              borderColor: 'rgba(232, 96, 28, 0.3)',
              color: '#E8601C',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
            }}
          >
            {stage.type === 'date' ? '📅 Add Date Range' : '+ Add Option'}
          </motion.button>

          {stage.options.length > 0 && (
            <div className="space-y-1.5">
              {stage.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLockOption(opt)}
                  className="w-full text-sm py-2 px-3 rounded-xl transition-colors text-left truncate"
                  style={{
                    background: 'rgba(29, 117, 117, 0.07)',
                    color: '#1D7575',
                    border: '1px solid rgba(29, 117, 117, 0.2)',
                    fontFamily: 'var(--font-body)',
                  }}
                  title={`Lock "${opt.title}"`}
                >
                  🔒 Lock &quot;{opt.title.length > 32 ? opt.title.slice(0, 32) + '…' : opt.title}&quot;
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddOptionModal
            key="add-option"
            stageId={stage.id}
            stageType={stage.type}
            memberId={currentMember.id}
            onAdded={onStageChanged}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lockOption && (
          <LockModal
            key="lock-modal"
            stage={stage}
            option={lockOption}
            memberId={currentMember.id}
            onLocked={onStageChanged}
            onClose={() => setLockOption(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
