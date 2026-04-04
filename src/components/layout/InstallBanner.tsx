import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export default function InstallBanner() {
  const { canInstall, showIOSHint, install, dismiss } = useInstallPrompt()

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          key="install-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-4 left-0 right-0 z-[9999] px-4"
        >
          <div className="max-w-lg mx-auto bg-white border border-green-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
            <span className="text-xl flex-shrink-0">📲</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Add to Home Screen</p>
              <p className="text-xs text-gray-500">Plan trips faster, works offline</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={install}
              className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Install
            </motion.button>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {showIOSHint && !canInstall && (
        <motion.div
          key="ios-hint"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-20 left-0 right-0 z-[9999] px-4"
        >
          <div className="max-w-lg mx-auto bg-gray-900 text-white rounded-2xl shadow-xl px-4 py-3 flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">📲</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Install in Safari</p>
              <p className="text-xs text-gray-300 mt-0.5">
                Open this link in <strong>Safari</strong>, then tap the Share button (
                <span className="font-mono">⎙</span>) → <strong>"Add to Home Screen"</strong>
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-gray-400 flex-shrink-0 text-xl leading-none mt-0.5"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
