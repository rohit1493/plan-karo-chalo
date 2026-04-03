import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { StageWithOptions } from '../../types'
import { stageLabel } from '../../lib/whatsapp'
import OptionCard from './OptionCard'

interface Props {
  stage: StageWithOptions
  totalMembers: number
}

export default function LockedStage({ stage, totalMembers }: Props) {
  const [expanded, setExpanded] = useState(false)
  const lockedOpt = stage.options.find((o) => o.id === stage.locked_option_id)

  return (
    <div className="bg-green-50 rounded-2xl border border-green-200 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={`${stageLabel(stage.type)}: ${lockedOpt?.title ?? 'locked'}. Click to ${expanded ? 'collapse' : 'expand'}`}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">🔒 Locked</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {stageLabel(stage.type)}:
            </span>
            <span className="text-sm text-gray-700 font-medium truncate max-w-[180px]">
              {lockedOpt?.title ?? '—'}
            </span>
          </div>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-green-400 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && lockedOpt && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {stage.options.map((opt) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  totalMembers={totalMembers}
                  isVotedByMe={false}
                  isLeading={opt.id === stage.locked_option_id}
                  isLocked={true}
                  onToggleVote={() => {}}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
