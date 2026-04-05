import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { supabase } from './lib/supabase.ts'

// Wake up the Supabase DB on app load — free tier pauses after inactivity.
// This runs in the background; failures are silently ignored.
void supabase.from('trips').select('id').limit(1)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
