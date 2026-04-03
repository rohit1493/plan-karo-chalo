import CreateTripForm from '../components/onboarding/CreateTripForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      {/* Hero */}
      <div className="bg-green-700 text-white text-center px-4 pt-12 pb-16">
        <div className="text-5xl mb-3">🌴</div>
        <h1 className="text-3xl font-bold mb-2">Plan Karo Chalo</h1>
        <p className="text-green-200 text-base max-w-xs mx-auto">
          No more WhatsApp chaos. One link. Everyone votes. Trip planned.
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 -mt-6 bg-[#FFFBF5] rounded-t-3xl px-4 pt-8 pb-8 max-w-lg mx-auto w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Start a trip</h2>
        <p className="text-sm text-gray-500 mb-6">Takes under 60 seconds. Share the link in WhatsApp.</p>
        <CreateTripForm />
      </div>

      {/* How it works */}
      <div className="bg-white border-t border-gray-100 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">How it works</h3>
          <div className="space-y-4">
            {[
              { icon: '🌴', title: 'Create a trip', desc: 'Enter trip name + your name in 30 seconds' },
              { icon: '📤', title: 'Share in WhatsApp', desc: 'One link to your group. No app download needed.' },
              { icon: '🗳️', title: 'Everyone votes', desc: 'Tap to vote on dates, location, stay, activities' },
              { icon: '🔒', title: 'Lock decisions', desc: 'You lock the winner. Trip moves forward.' },
              { icon: '✅', title: 'Trip confirmed', desc: 'One page. Everything decided. Ready to book.' },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{step.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
