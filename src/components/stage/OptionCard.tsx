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
  const cardStyle = isLocked
    ? {
        borderColor: '#1D7575',
        background: 'rgba(29, 117, 117, 0.06)',
      }
    : isVotedByMe
    ? undefined // handled by .option-card-voted class
    : isLeading
    ? undefined // handled by .option-card-leading class
    : {
        borderColor: '#E5DDD2',
        background: '#FFFFFF',
      }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative rounded-2xl border-2 p-4 transition-all ${
        isLocked
          ? ''
          : isVotedByMe
          ? 'option-card-voted'
          : isLeading
          ? 'option-card-leading'
          : ''
      }`}
      style={cardStyle}
    >
      {/* Badge */}
      {isLeading && !isLocked && (
        <span
          className="absolute top-3 right-3 text-[11px] px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: 'rgba(232, 96, 28, 0.1)',
            color: '#E8601C',
            border: '1px solid rgba(232, 96, 28, 0.2)',
            fontFamily: 'var(--font-body)',
          }}
        >
          ✨ Leading
        </span>
      )}
      {isLocked && (
        <span
          className="absolute top-3 right-3 text-[11px] px-2.5 py-0.5 rounded-full font-semibold text-white"
          style={{ background: '#1D7575', fontFamily: 'var(--font-body)' }}
        >
          🔒 Chosen
        </span>
      )}

      <div className={isLocked || isLeading ? 'pr-20' : 'pr-4'}>
        <p
          className="font-semibold text-sm"
          style={{ color: '#120D09', fontFamily: 'var(--font-body)' }}
        >
          {option.title}
        </p>

        {option.link && isValidUrl(option.link) && (
          <a
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs mt-1 font-medium hover:underline"
            style={{ color: '#1D7575' }}
          >
            🔗 View link
          </a>
        )}
        {option.link && !isValidUrl(option.link) && (
          <span
            className="text-xs mt-1 block"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
          >
            ⚠️ Invalid link
          </span>
        )}

        {option.notes && (
          <p
            className="text-xs mt-1 leading-relaxed"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
          >
            {option.notes}
          </p>
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
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60"
            style={{
              background: isVotedByMe ? '#E8601C' : 'rgba(18, 13, 9, 0.07)',
              color: isVotedByMe ? '#FFFFFF' : '#4A3D33',
              fontFamily: 'var(--font-body)',
            }}
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
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{ color: '#C44A12', fontFamily: 'var(--font-body)' }}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
