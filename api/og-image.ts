import { ImageResponse } from '@vercel/og'
import { createElement as h } from 'react'

// Node.js serverless runtime (not edge) — @vercel/og works in both;
// keeping this as serverless avoids Edge Middleware bundling conflicts.

export default async function handler(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') ?? ''

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  let tripName = 'Group Trip'
  let memberCount = 0

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/trips?invite_code=eq.${code}&select=id,name`,
      { headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey}` } }
    )
    const [trip] = await res.json()
    if (trip?.name) {
      tripName = trip.name
      const mRes = await fetch(
        `${supabaseUrl}/rest/v1/members?trip_id=eq.${trip.id}&select=id`,
        { headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey}` } }
      )
      const members = await mRes.json()
      memberCount = Array.isArray(members) ? members.length : 0
    }
  } catch {
    // fall through with defaults
  }

  const fontSize = tripName.length > 30 ? 44 : 56

  return new ImageResponse(
    h('div', {
      style: {
        width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A3A2A 0%, #166534 50%, #15803D 100%)',
      }
    },
      h('div', { style: { fontSize: 80, marginBottom: 24 } }, '🌴'),
      h('div', {
        style: {
          fontSize, fontWeight: 800, color: 'white', textAlign: 'center',
          maxWidth: 900, lineHeight: 1.2, padding: '0 40px',
        }
      }, tripName),
      h('div', { style: { fontSize: 26, color: '#86EFAC', marginTop: 16, fontWeight: 600 } },
        'Plan Karo Chalo 🌴'),
      memberCount > 0
        ? h('div', { style: { fontSize: 20, color: '#BBF7D0', marginTop: 10 } },
            `${memberCount} ${memberCount === 1 ? 'person' : 'people'} planning this trip`)
        : null,
      h('div', {
        style: {
          marginTop: 36, background: 'rgba(255,255,255,0.15)', borderRadius: 16,
          padding: '14px 32px', fontSize: 20, color: 'white', fontWeight: 600,
        }
      }, 'Join & vote — no sign-up needed ✈️')
    ),
    { width: 1200, height: 630 }
  )
}
