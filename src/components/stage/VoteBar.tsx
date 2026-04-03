import { motion } from 'framer-motion'

interface Props {
  voteCount: number
  totalMembers: number
  voters: { id: string; name: string }[]
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#F97316', '#14B8A6', '#6366F1', '#F43F5E',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function VoteBar({ voteCount, totalMembers, voters }: Props) {
  const pct = totalMembers > 0 ? Math.round((voteCount / totalMembers) * 100) : 0

  return (
    <div className="mt-3">
      {/* Animated bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}
            initial={{ width: 0 }}
            animate={{ width: voteCount > 0 ? `${Math.max(pct, 8)}%` : '0%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-gray-500 w-12 text-right flex-shrink-0">
          {voteCount}/{totalMembers}
        </span>
      </div>

      {/* Overlapping avatar stack */}
      {voters.length > 0 && (
        <div className="flex items-center mt-2 gap-0.5">
          <div className="flex" style={{ direction: 'ltr' }}>
            {voters.slice(0, 6).map((v, i) => (
              <motion.div
                key={v.id}
                title={v.name}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white"
                style={{
                  background: avatarColor(v.name),
                  marginLeft: i > 0 ? '-6px' : '0',
                  zIndex: voters.length - i,
                  position: 'relative',
                }}
              >
                {initials(v.name)}
              </motion.div>
            ))}
          </div>
          {voters.length > 6 && (
            <span className="text-xs text-gray-400 ml-2">+{voters.length - 6} more</span>
          )}
          {voters.length === 1 && (
            <span className="text-xs text-gray-500 ml-2">{voters[0].name} voted</span>
          )}
        </div>
      )}
    </div>
  )
}
