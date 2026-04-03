import { motion } from 'framer-motion'
import CreateTripForm from '../components/onboarding/CreateTripForm'

const PARTICLES = [
  { emoji: '🌴', top: '12%', left: '8%', duration: '5s', delay: '0s' },
  { emoji: '✈️', top: '20%', right: '10%', duration: '6.5s', delay: '1s' },
  { emoji: '🏖️', top: '55%', left: '5%', duration: '4.5s', delay: '2s' },
  { emoji: '🗓️', top: '70%', right: '8%', duration: '7s', delay: '0.5s' },
  { emoji: '🎒', top: '35%', right: '5%', duration: '5.5s', delay: '1.5s' },
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
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Hero ─────────────────────────────── */}
      <div className="gradient-hero text-white relative overflow-hidden px-4 pt-14 pb-20 text-center">
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

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="text-6xl mb-4 relative z-10 breathe inline-block"
        >
          🌴
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold mb-3 relative z-10 tracking-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Plan Karo Chalo
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-green-200 text-base max-w-xs mx-auto relative z-10 leading-relaxed"
        >
          No more WhatsApp chaos.&nbsp;
          <br />
          One link. Everyone votes. Trip planned. ✨
        </motion.p>
      </div>

      {/* ── Form card ────────────────────────── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        className="flex-1 -mt-6 bg-[#FFFBF5] rounded-t-3xl px-4 pt-8 pb-8 max-w-lg mx-auto w-full"
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.08)' }}
      >
        <h2
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Start a trip
        </h2>
        <p className="text-sm text-gray-500 mb-7">Takes under 60 seconds. Share the link in WhatsApp.</p>
        <CreateTripForm />
      </motion.div>

      {/* ── How it works ─────────────────────── */}
      <div className="bg-white border-t border-gray-100 px-4 py-10">
        <div className="max-w-lg mx-auto">
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
