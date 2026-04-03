export default function OfflineBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center text-sm font-medium py-2 px-4"
    >
      📡 You're offline — votes won't save until you reconnect
    </div>
  )
}
