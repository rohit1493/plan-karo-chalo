import { motion } from 'framer-motion'
import CreateTripForm from '../components/onboarding/CreateTripForm'

const PARTICLES = [
  { emoji: '🌴', top: '8%',  left: '4%',  duration: '5s',   delay: '0s' },
  { emoji: '✈️', top: '10%', right: '4%', duration: '6.5s', delay: '1s' },
  { emoji: '🎒', top: '60%', right: '4%', duration: '5.5s', delay: '1.5s' },
  { emoji: '🗓️', top: '65%', left: '4%',  duration: '7s',   delay: '0.5s' },
]

const STEPS = [
  { icon: '🌴', title: 'Create a trip', desc: 'Trip name + your name — 30 seconds flat' },
  { icon: '📤', title: 'Share in WhatsApp', desc: 'One link. No app download needed.' },
  { icon: '🗳️', title: 'Everyone votes', desc: 'Dates, location, stay, activities' },
  { icon: '🔒', title: 'Lock decisions', desc: 'You lock the winner. Trip moves forward.' },
  { icon: '✅', title: 'Trip confirmed', desc: 'One page. Everything decided.' },
]

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Hero ─────────────────────────────── */}
      <div className="gradient-hero text-white relative overflow-hidden px-6 pt-10 pb-20 flex flex-col items-center justify-center">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              top: p.top,
              left: (p as any).left,
              right: (p as any).right,
              ['--duration' as any]: p.duration,
              ['--delay' as any]: p.delay,
            }}
          >
            {p.emoji}
          </span>
        ))}

        {/* Centered content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="text-5xl mb-3 breathe inline-block leading-none"
          >
            🌴
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.2 }}
            className="text-3xl font-extrabold tracking-tight leading-tight mb-3"
          >
            Plan Karo Chalo
          </motion.h1>

          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.45 }}
            className="text-green-200 text-sm leading-relaxed"
          >
            No WhatsApp chaos. One link, everyone votes. ✨
          </motion.p>
        </div>
      </div>

      {/* ── Form card — full-width sheet, content centered ── */}
      <div
        className="-mt-16 relative z-10 bg-[#FFFBF5] rounded-t-3xl"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
      >
        <div className="max-w-lg mx-auto px-4 pt-5 pb-8">
          {/* Handle */}
          <div className="w-9 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Start a trip
          </h2>
          <p className="text-sm text-gray-500 mb-7">Takes under 60 seconds. Share the link in WhatsApp.</p>
          <CreateTripForm />
        </div>
      </div>

      {/* ── How it works ─────────────────────── */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 text-center">
            How it works
          </p>
          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                className="flex items-start gap-4"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
