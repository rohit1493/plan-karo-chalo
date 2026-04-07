import type { StageType } from '../../types'
import { stageLabel } from '../../lib/whatsapp'

const stageIcons: Record<StageType, string> = {
  date: '🗓️',
  location: '📍',
  stay: '🏨',
  activity: '🎯',
}

interface Props {
  type: StageType
}

export default function UpcomingStage({ type }: Props) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5 opacity-40"
      style={{
        background: 'rgba(18, 13, 9, 0.03)',
        border: '1.5px dashed rgba(18, 13, 9, 0.15)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ background: 'rgba(18, 13, 9, 0.08)' }}
        >
          {stageIcons[type]}
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: '#4A3D33', fontFamily: 'var(--font-display)' }}
        >
          {stageLabel(type)}
        </span>
        <span
          className="text-xs ml-auto font-medium"
          style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
        >
          Upcoming
        </span>
      </div>
    </div>
  )
}
