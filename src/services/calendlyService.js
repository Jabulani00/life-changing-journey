/**
 * Calendly REST API — uses EXPO_PUBLIC_CALENDLY_TOKEN (Bearer).
 * Optional: EXPO_PUBLIC_CALENDLY_USER_URI after resolving /users/me once.
 */
const BASE = 'https://api.calendly.com'

function getToken() {
  const t = process.env.EXPO_PUBLIC_CALENDLY_TOKEN
  return typeof t === 'string' ? t.trim() : ''
}

function headers() {
  const token = getToken()
  if (!token) throw new Error('Calendly token missing. Set EXPO_PUBLIC_CALENDLY_TOKEN in .env')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function parseJson(res) {
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }
  if (!res.ok) {
    const msg = data?.message || data?.title || text || res.statusText
    throw new Error(`Calendly API ${res.status}: ${msg}`)
  }
  return data
}

/**
 * @returns {Promise<string>} resource.uri for the authenticated user
 */
export async function getMyUserUri() {
  const envUri = process.env.EXPO_PUBLIC_CALENDLY_USER_URI
  if (typeof envUri === 'string' && envUri.trim().startsWith('http')) {
    return envUri.trim()
  }
  const res = await fetch(`${BASE}/users/me`, { headers: headers() })
  const data = await parseJson(res)
  const uri = data?.resource?.uri
  if (!uri) throw new Error('Calendly /users/me returned no resource.uri')
  return uri
}

export async function getEventTypes(userUri) {
  const q = encodeURIComponent(userUri)
  const res = await fetch(`${BASE}/event_types?user=${q}&active=true`, { headers: headers() })
  const data = await parseJson(res)
  return data?.collection ?? []
}

export async function getScheduledEvents(userUri) {
  const q = encodeURIComponent(userUri)
  const res = await fetch(`${BASE}/scheduled_events?user=${q}&status=active`, { headers: headers() })
  const data = await parseJson(res)
  return data?.collection ?? []
}

/**
 * @param {string} eventUuid - UUID segment of scheduled event (not full URL)
 */
export async function getEventInvitees(eventUuid) {
  const id = extractUuid(eventUuid)
  const res = await fetch(`${BASE}/scheduled_events/${encodeURIComponent(id)}/invitees`, {
    headers: headers(),
  })
  const data = await parseJson(res)
  return data?.collection ?? []
}

/**
 * @param {string} eventUuid - UUID or full scheduled_events URI
 * @param {string} [reason]
 */
export async function cancelEvent(eventUuid, reason = 'Cancelled by admin') {
  const id = extractUuid(eventUuid)
  const res = await fetch(`${BASE}/scheduled_events/${encodeURIComponent(id)}/cancellation`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ reason: String(reason || '') }),
  })
  await parseJson(res)
  return true
}

export function extractUuid(uriOrUuid) {
  if (!uriOrUuid) return ''
  const s = String(uriOrUuid).trim()
  if (/^[a-f0-9-]{30,}$/i.test(s) && !s.includes('/')) return s
  const parts = s.split('/').filter(Boolean)
  return parts[parts.length - 1] || s
}
