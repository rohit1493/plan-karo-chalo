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
    <div className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 opacity-50">
      <div className="flex items-center gap-2">
        <span className="text-base">{stageIcons[type]}</span>
        <span className="text-sm font-medium text-gray-500">{stageLabel(type)}</span>
        <span className="text-xs text-gray-400 ml-auto">Upcoming</span>
      </div>
    </div>
  )
}
