import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import TripPage from './pages/TripPage'

function NotFoundPage() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-xs">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 mb-6">This link doesn't exist or may have expired.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 bg-green-600 text-white font-semibold px-5 py-3 rounded-xl text-sm"
        >
          Start a new trip →
        </Link>
      </div>
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/trip/:inviteCode" element={<TripPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '14px',
            padding: '12px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
