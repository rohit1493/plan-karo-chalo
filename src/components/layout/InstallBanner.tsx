import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

interface Props {
  isPlanner: boolean
}

export default function InstallBanner({ isPlanner }: Props) {
  const { canInstall, install, dismiss } = useInstallPrompt()

  return (
    <AnimatePresence>
      {isPlanner && canInstall && (
        <motion.div
          key="install-banner"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 pt-2"
        >
          <div
            className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3"
            style={{ border: '1px solid rgba(232, 96, 28, 0.2)' }}
          >
            <span className="text-xl flex-shrink-0" aria-hidden="true">📲</span>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: '#120D09', fontFamily: 'var(--font-display)' }}
              >
                Add to Home Screen
              </p>
              <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}>
                Plan trips faster, works offline
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={install}
              className="text-white text-xs font-bold px-3 py-1.5 rounded-xl btn-glow flex-shrink-0"
              style={{
                background: '#E8601C',
                fontFamily: 'var(--font-display)',
              }}
            >
              Install
            </motion.button>
            <button
              onClick={dismiss}
              aria-label="Dismiss install prompt"
              className="flex-shrink-0 text-xl leading-none"
              style={{ color: 'var(--color-muted)' }}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
