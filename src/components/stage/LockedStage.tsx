import { useState } from 'react'
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
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">🔒 Locked</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-semibold text-gray-900">{stageLabel(stage.type)}:</span>
            <span className="text-sm text-gray-700">{lockedOpt?.title ?? '—'}</span>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && lockedOpt && (
        <div className="px-4 pb-4 space-y-2">
          {stage.options.map((opt) => (
            <OptionCard
              key={opt.id}
              option={opt}
              totalMembers={totalMembers}
              isVotedByMe={false}
              isLeading={opt.id === stage.locked_option_id}
              isLocked={opt.id === stage.locked_option_id}
              onToggleVote={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
