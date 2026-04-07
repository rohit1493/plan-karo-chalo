import { motion } from 'framer-motion'
import CreateTripForm from '../components/onboarding/CreateTripForm'

const STEPS = [
  { num: '01', icon: '🌴', title: 'Create a trip', desc: 'Trip name + your name — 30 seconds flat' },
  { num: '02', icon: '📤', title: 'Share in WhatsApp', desc: 'One link. No app download needed.' },
  { num: '03', icon: '🗳️', title: 'Everyone votes', desc: 'Dates, location, stay, activities' },
  { num: '04', icon: '🔒', title: 'Lock decisions', desc: 'You lock the winner. Trip moves forward.' },
  { num: '05', icon: '✅', title: 'Trip confirmed', desc: 'One page. Everything decided.' },
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
      <div className="gradient-hero text-white relative overflow-hidden px-6 pt-14 pb-24">
        {/* Dot grid — top right */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-56 h-56 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0A500 1.5px, transparent 1.5px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Dot grid — bottom left */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-0 w-40 h-40 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #E8601C 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 relative z-10"
          style={{
            background: 'rgba(232, 96, 28, 0.18)',
            border: '1px solid rgba(232, 96, 28, 0.35)',
          }}
        >
          <span className="text-sm" aria-hidden="true">✈️</span>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#F0A500', fontFamily: 'var(--font-body)' }}
          >
            Group Trip Planner
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="relative z-10 max-w-xs">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-[0.9] tracking-tight mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 14vw, 4.5rem)',
            }}
          >
            Plan{' '}
            <span style={{ color: '#E8601C' }}>Karo</span>
            <br />
            Chalo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-[15px] leading-relaxed"
            style={{ color: 'rgba(255, 245, 228, 0.65)', fontFamily: 'var(--font-body)' }}
          >
            No more WhatsApp chaos.
            <br />
            One link. Everyone votes. Trip planned.
          </motion.p>
        </div>

        {/* Saffron accent bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 52, opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.45, ease: 'easeOut' }}
          className="h-[3px] rounded-full mt-6 relative z-10"
          style={{ background: '#E8601C' }}
        />
      </div>

      {/* ── Form card ────────────────────────── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        className="-mt-6 rounded-t-3xl px-4 pt-8 pb-8 max-w-lg mx-auto w-full flex-1"
        style={{
          background: 'var(--color-paper)',
          boxShadow: '0 -8px 40px rgba(18, 13, 9, 0.14)',
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'rgba(232, 96, 28, 0.1)', border: '1px solid rgba(232, 96, 28, 0.18)' }}
            aria-hidden="true"
          >
            🌴
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#120D09' }}
          >
            Start a trip
          </h2>
        </div>
        <p
          className="text-sm mb-7 ml-12"
          style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
        >
          Takes under 60 seconds. Share the link in WhatsApp.
        </p>
        <CreateTripForm />
      </motion.div>

      {/* ── How it works ─────────────────────── */}
      <div style={{ background: '#120D09' }} className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-7 text-center"
            style={{ color: 'rgba(240, 165, 0, 0.7)', fontFamily: 'var(--font-body)' }}
          >
            How it works
          </p>
          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                className="flex items-start gap-4"
                initial={{ x: -16, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(232, 96, 28, 0.13)',
                    border: '1px solid rgba(232, 96, 28, 0.22)',
                    color: '#E8601C',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: '800',
                  }}
                >
                  {step.num}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" aria-hidden="true">{step.icon}</span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#F5EDE0', fontFamily: 'var(--font-body)' }}
                    >
                      {step.title}
                    </p>
                  </div>
                  <p
                    className="text-sm mt-0.5 leading-relaxed"
                    style={{ color: 'rgba(245, 237, 224, 0.48)', fontFamily: 'var(--font-body)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
