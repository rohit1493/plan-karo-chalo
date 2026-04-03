import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { addOption } from '../../api/options'

interface Props {
  stageId: string
  memberId: string
  onAdded: () => void
  onClose: () => void
}

export default function AddOptionModal({ stageId, memberId, onAdded, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  function isValidUrl(url: string): boolean {
    if (!url.trim()) return true
    try {
      const p = new URL(url.trim())
      return p.protocol === 'http:' || p.protocol === 'https:'
    } catch { return false }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (link.trim() && !isValidUrl(link)) {
      toast.error('Link must start with http:// or https://')
      return
    }
    setLoading(true)
    try {
      await addOption(stageId, title.trim(), memberId, link.trim() || undefined, notes.trim() || undefined)
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
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white rounded-t-3xl w-full max-w-lg px-6 pb-8 pt-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      >
        <div className="bottom-sheet-handle" />

        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Add an option
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <motion.button
            type="submit"
            disabled={!title.trim() || loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-colors btn-glow disabled:shadow-none text-base"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {loading ? 'Adding…' : 'Add Option ✓'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
