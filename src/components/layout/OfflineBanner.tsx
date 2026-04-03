import { motion } from 'framer-motion'

export default function OfflineBanner() {
  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-red-500 text-white text-center text-sm font-medium px-4 py-2 relative z-50"
    >
      📵 You're offline — changes won't save until you reconnect
    </motion.div>
  )
}
