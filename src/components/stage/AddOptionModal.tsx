import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { addOption } from '../../api/options'

interface Props {
  stageId: string
  stageType: string
  memberId: string
  onAdded: () => void
  onClose: () => void
}

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const s = new Date(start + 'T00:00:00').toLocaleDateString('en-IN', opts)
  const e = new Date(end + 'T00:00:00').toLocaleDateString('en-IN', opts)
  const year = new Date(end + 'T00:00:00').getFullYear()
  return `${s} – ${e}, ${year}`
}

export default function AddOptionModal({ stageId, stageType, memberId, onAdded, onClose }: Props) {
  const isDateStage = stageType === 'date'

  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  function handleStartDate(val: string) {
    setStartDate(val)
    if (val && endDate) setTitle(formatDateRange(val, endDate))
  }

  function handleEndDate(val: string) {
    setEndDate(val)
    if (startDate && val) setTitle(formatDateRange(startDate, val))
  }

  function isValidUrl(url: string): boolean {
    if (!url.trim()) return true
    try {
      const p = new URL(url.trim())
      return p.protocol === 'http:' || p.protocol === 'https:'
    } catch { return false }
  }

  const canSubmit = isDateStage
    ? !!(startDate && endDate && endDate >= startDate)
    : !!title.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    if (link.trim() && !isValidUrl(link)) {
      toast.error('Link must start with http:// or https://')
      return
    }
    const finalTitle = isDateStage
      ? (title.trim() || formatDateRange(startDate, endDate))
      : title.trim()

    setLoading(true)
    try {
      await addOption(stageId, finalTitle, memberId, link.trim() || undefined, notes.trim() || undefined)
      onAdded()
      onClose()
      toast.success('Option added!')
    } catch {
      toast.error('Failed to add option. Try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(18, 13, 9, 0.55)' }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl px-6 pb-8 pt-4"
        style={{ background: 'var(--color-paper)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      >
        <div className="bottom-sheet-handle" />

        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            {isDateStage ? 'Pick a date range' : 'Add an option'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(18, 13, 9, 0.07)',
              color: 'var(--color-muted)',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isDateStage ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="float-label-wrapper">
                  <input
                    autoFocus
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => handleStartDate(e.target.value)}
                    className="float-label-input"
                    placeholder=" "
                  />
                  <label htmlFor="startDate" className="float-label-text">From</label>
                </div>
                <div className="float-label-wrapper">
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => handleEndDate(e.target.value)}
                    className="float-label-input"
                    placeholder=" "
                  />
                  <label htmlFor="endDate" className="float-label-text">To</label>
                </div>
              </div>

              {title && (
                <div
                  className="rounded-xl px-3 py-2.5"
                  style={{
                    background: 'rgba(232, 96, 28, 0.07)',
                    border: '1px solid rgba(232, 96, 28, 0.2)',
                  }}
                >
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: '#E8601C', fontFamily: 'var(--font-body)' }}
                  >
                    Option title (tap to edit)
                  </p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm font-semibold w-full bg-transparent outline-none"
                    style={{ color: '#120D09', fontFamily: 'var(--font-body)' }}
                    placeholder="e.g. Jul 10–15, 2026"
                  />
                </div>
              )}

              <div className="float-label-wrapper">
                <input
                  type="text"
                  id="optNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder=" "
                  maxLength={200}
                  className="float-label-input"
                />
                <label htmlFor="optNotes" className="float-label-text">Notes (optional — long weekend, avoid monsoon…)</label>
              </div>
            </>
          ) : (
            <>
              <div className="float-label-wrapper">
                <input
                  autoFocus
                  type="text"
                  id="optTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=" "
                  maxLength={100}
                  className="float-label-input"
                />
                <label htmlFor="optTitle" className="float-label-text">Title* (e.g. Zostel Anjuna)</label>
              </div>

              <div className="float-label-wrapper">
                <input
                  type="url"
                  id="optLink"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder=" "
                  className="float-label-input"
                />
                <label htmlFor="optLink" className="float-label-text">Link (optional)</label>
              </div>

              <div className="float-label-wrapper">
                <input
                  type="text"
                  id="optNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder=" "
                  maxLength={200}
                  className="float-label-input"
                />
                <label htmlFor="optNotes" className="float-label-text">Notes (optional — ₹800/night, pool…)</label>
              </div>
            </>
          )}

          <motion.button
            type="submit"
            disabled={!canSubmit || loading}
            whileTap={{ scale: 0.97 }}
            className="w-full text-white font-bold py-4 rounded-2xl transition-colors btn-glow disabled:shadow-none text-base"
            style={{
              background: !canSubmit || loading ? '#E5DDD2' : '#E8601C',
              color: !canSubmit || loading ? '#9B8F82' : '#FFFFFF',
              fontFamily: 'var(--font-display)',
            }}
          >
            {loading ? 'Adding…' : 'Add Option ✓'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
