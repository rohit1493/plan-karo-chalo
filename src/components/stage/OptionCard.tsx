import type { OptionWithVotes } from '../../types'
import VoteBar from './VoteBar'

interface Props {
  option: OptionWithVotes
  totalMembers: number
  isVotedByMe: boolean
  isPending?: boolean
  isLeading: boolean
  isLocked: boolean
  onToggleVote: (optionId: string) => void
  onDelete?: (optionId: string) => void
  canDelete?: boolean
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function OptionCard({
  option,
  totalMembers,
  isVotedByMe,
  isPending = false,
  isLeading,
  isLocked,
  onToggleVote,
  onDelete,
  canDelete,
}: Props) {
  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all ${
        isLocked
          ? 'border-green-500 bg-green-50'
          : isLeading
          ? 'border-green-300 bg-white'
          : 'border-gray-200 bg-white'
      }`}
    >
      {isLeading && !isLocked && (
        <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          Leading
        </span>
      )}
      {isLocked && (
        <span className="absolute top-3 right-3 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
          🔒 Chosen
        </span>
      )}

      <div className="pr-16">
        <p className="font-medium text-gray-900">{option.title}</p>

        {option.link && isValidUrl(option.link) && (
          <a
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            🔗 View link
          </a>
        )}
        {option.link && !isValidUrl(option.link) && (
          <span className="text-xs text-gray-400 mt-1 block">⚠️ Invalid link</span>
        )}

        {option.notes && (
          <p className="text-sm text-gray-500 mt-1">{option.notes}</p>
        )}
      </div>

      <VoteBar voteCount={option.vote_count} totalMembers={totalMembers} voters={option.voters} />

      {!isLocked && (
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => onToggleVote(option.id)}
            disabled={isPending}
            aria-label={isVotedByMe ? `Remove vote for ${option.title}` : `Vote for ${option.title}`}
            aria-pressed={isVotedByMe}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
              isVotedByMe
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isPending ? '…' : isVotedByMe ? '✓ Voted' : '+ Vote'}
          </button>

          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(option.id)}
              aria-label={`Remove option: ${option.title}`}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}
