import { motion } from 'framer-motion'
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative rounded-2xl border-2 p-4 transition-all ${
        isLocked
          ? 'border-green-500 bg-green-50'
          : isVotedByMe
          ? 'option-card-voted border-green-400 bg-white'
          : isLeading
          ? 'option-card-leading border-green-300'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Badge */}
      {isLeading && !isLocked && (
        <span className="absolute top-3 right-3 text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
          ✨ Leading
        </span>
      )}
      {isLocked && (
        <span className="absolute top-3 right-3 text-[11px] bg-green-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
          🔒 Chosen
        </span>
      )}

      <div className={isLocked || isLeading ? 'pr-20' : 'pr-4'}>
        <p className="font-semibold text-gray-900 text-sm">{option.title}</p>

        {option.link && isValidUrl(option.link) && (
          <a
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1 font-medium"
          >
            🔗 View link
          </a>
        )}
        {option.link && !isValidUrl(option.link) && (
          <span className="text-xs text-gray-400 mt-1 block">⚠️ Invalid link</span>
        )}

        {option.notes && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{option.notes}</p>
        )}
      </div>

      <VoteBar voteCount={option.vote_count} totalMembers={totalMembers} voters={option.voters} />

      {!isLocked && (
        <div className="flex items-center justify-between mt-3">
          <motion.button
            onClick={() => onToggleVote(option.id)}
            disabled={isPending}
            aria-label={isVotedByMe ? `Remove vote for ${option.title}` : `Vote for ${option.title}`}
            aria-pressed={isVotedByMe}
            whileTap={{ scale: 0.93 }}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${
              isVotedByMe
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isPending ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
            ) : isVotedByMe ? (
              <>✓ Voted</>
            ) : (
              <>+ Vote</>
            )}
          </motion.button>

          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(option.id)}
              aria-label={`Remove option: ${option.title}`}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
