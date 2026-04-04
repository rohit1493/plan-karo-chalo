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
    <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 px-4 py-3.5 opacity-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center text-sm">
          {stageIcons[type]}
        </div>
        <span className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {stageLabel(type)}
        </span>
        <span className="text-xs text-gray-400 ml-auto font-medium">Upcoming</span>
      </div>
    </div>
  )
}
