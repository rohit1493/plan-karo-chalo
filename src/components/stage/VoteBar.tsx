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
  'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400',
  'bg-orange-400', 'bg-teal-400', 'bg-indigo-400', 'bg-rose-400',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function VoteBar({ voteCount, totalMembers, voters }: Props) {
  const pct = totalMembers > 0 ? Math.round((voteCount / totalMembers) * 100) : 0

  return (
    <div className="mt-2">
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: voteCount > 0 ? `${Math.max(pct, 8)}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-gray-500 w-10 text-right">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Voter avatars */}
      {voters.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {voters.slice(0, 8).map((v) => (
            <div
              key={v.id}
              title={v.name}
              className={`${avatarColor(v.name)} text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center`}
            >
              {initials(v.name)}
            </div>
          ))}
          {voters.length > 8 && (
            <div className="bg-gray-200 text-gray-600 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
              +{voters.length - 8}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
