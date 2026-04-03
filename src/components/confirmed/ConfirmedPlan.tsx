import type { StageWithOptions } from '../../types'
import { stageLabel } from '../../lib/whatsapp'

const STAGE_ICONS: Record<string, string> = {
  date: '📅',
  location: '📍',
  stay: '🏨',
  activity: '🎯',
}

interface Props {
  stages: StageWithOptions[]
}

export default function ConfirmedPlan({ stages }: Props) {
  const lockedStages = stages.filter((s) => s.is_locked)

  return (
    <div className="bg-white rounded-2xl border-2 border-green-300 overflow-hidden">
      <div className="bg-green-600 px-4 py-4 text-center">
        <div className="text-2xl mb-1">🎉</div>
        <h2 className="text-lg font-bold text-white">Trip Confirmed!</h2>
        <p className="text-sm text-green-100 mt-0.5">Here's everything you decided</p>
      </div>

      <div className="divide-y divide-gray-100">
        {lockedStages.map((stage) => {
          // Prefer fetched option from options array; fallback to locked_option relation
          const locked =
            stage.options.find((o) => o.id === stage.locked_option_id) ??
            (stage.locked_option as any) ??
            null
          if (!locked) return null
          return (
            <div key={stage.id} className="px-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{STAGE_ICONS[stage.type]}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {stageLabel(stage.type)}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-900">{locked.title}</p>
              {locked.notes && (
                <p className="text-sm text-gray-500 mt-0.5">{locked.notes}</p>
              )}
              {locked.link && (
                <a
                  href={locked.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  🔗 View details
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
