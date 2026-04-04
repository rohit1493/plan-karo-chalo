/**
 * Vercel Edge Middleware — runs on every request before the SPA is served.
 * For /trip/:code requests from bot user agents (WhatsApp, Facebook, etc.)
 * we serve a minimal HTML page with dynamic OG meta tags so link previews
 * show the actual trip name. Human browsers fall through to the SPA normally.
 */

export const config = {
  matcher: '/trip/:path*',
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get('user-agent') ?? ''
  const isBot =
    /whatsapp|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|bingbot|googlebot/i.test(
      ua
    )

  if (!isBot) return // human browser → continue to SPA

  const code = new URL(request.url).pathname.split('/trip/')[1]?.split(/[/?#]/)[0] ?? ''

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  const appUrl = (process.env.VITE_APP_URL ?? 'https://pkc-kappa.vercel.app').trim()

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

  const safeName = escapeHtml(tripName)
  const tripUrl = `${appUrl}/trip/${code}`
  const ogImageUrl = `${appUrl}/api/og-image?code=${code}`
  const description = memberCount > 0
    ? `${memberCount} ${memberCount === 1 ? 'person is' : 'people are'} planning this trip. Join & vote — no sign-up needed!`
    : 'Help decide dates, location, stay & activities. Join & vote — no sign-up needed!'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeName} — Plan Karo Chalo 🌴</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${safeName} — Plan Karo Chalo 🌴" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${tripUrl}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeName} — Plan Karo Chalo 🌴" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
</head>
<body></body>
</html>`

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}
