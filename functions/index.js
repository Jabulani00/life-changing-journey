/**
 * HTTP Cloud Function: Calendly webhook → Firestore `bookings`.
 * Register URL in Calendly → Integrations → Webhooks: invitee.created, invitee.canceled.
 *
 * Set secret: firebase functions:secrets:set CALENDLY_PERSONAL_ACCESS_TOKEN
 * Or use functions config (legacy): firebase functions:config:set calendly.token="..."
 */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { deleteUserData, isUserAdmin } = require('./lib/deleteUserData')

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

function tokenFromEnv() {
  return (
    process.env.CALENDLY_PERSONAL_ACCESS_TOKEN ||
    process.env.CALENDLY_TOKEN ||
    (functions.config().calendly && functions.config().calendly.token) ||
    ''
  ).trim()
}

async function fetchCalendlyJson(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }
  if (!res.ok) {
    throw new Error(`Calendly ${res.status}: ${data?.message || text}`)
  }
  return data
}

function extractUuid(uriOrUuid) {
  if (!uriOrUuid) return ''
  const s = String(uriOrUuid).trim()
  if (/^[a-f0-9-]{30,}$/i.test(s) && !s.includes('/')) return s
  const parts = s.split('/').filter(Boolean)
  return parts[parts.length - 1] || s
}

async function findUserIdByEmail(email) {
  if (!email) return null
  const snap = await db.collection('users').where('email', '==', email).limit(1).get()
  if (snap.empty) return null
  return snap.docs[0].id
}

exports.calendlyWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const token = tokenFromEnv()
  if (!token) {
    console.error('Missing CALENDLY_PERSONAL_ACCESS_TOKEN / calendly.token')
    res.status(500).send('Server misconfigured')
    return
  }

  const body = req.body || {}
  const event = body.event
  const payload = body.payload || {}

  try {
    if (event === 'invitee.created') {
      const eventUri = payload.event || payload.scheduled_event
      const inviteeUri = payload.invitee

      let inviteeEmail = payload.email || null
      let inviteeName = payload.name || null

      if (inviteeUri && typeof inviteeUri === 'string') {
        try {
          const invJson = await fetchCalendlyJson(inviteeUri, token)
          const r = invJson.resource || invJson
          inviteeEmail = r.email || inviteeEmail
          inviteeName = r.name || inviteeName
        } catch (e) {
          console.warn('Invitee fetch', e?.message)
        }
      }

      let scheduledAt = admin.firestore.FieldValue.serverTimestamp()
      let startIso = null
      if (eventUri && typeof eventUri === 'string') {
        try {
          const evUuid = extractUuid(eventUri)
          const evJson = await fetchCalendlyJson(
            `https://api.calendly.com/scheduled_events/${encodeURIComponent(evUuid)}`,
            token
          )
          const ev = evJson.resource || evJson
          startIso = ev?.start_time || null
          if (startIso) {
            const d = new Date(startIso)
            if (!Number.isNaN(d.getTime())) {
              scheduledAt = admin.firestore.Timestamp.fromDate(d)
            }
          }
        } catch (e) {
          console.warn('Event fetch', e?.message)
        }
      }

      const userId = (await findUserIdByEmail(inviteeEmail)) || 'unknown'
      const bookingRef = db.collection('bookings').doc()
      await bookingRef.set(
        {
          userId,
          userEmail: inviteeEmail || '',
          userName: inviteeName || inviteeEmail || 'Calendly invitee',
          plan: 'silver',
          planCategory: 'adults',
          priority: 0,
          eventUri: eventUri || '',
          inviteeUri: inviteeUri || '',
          scheduledAt,
          status: 'confirmed',
          discountApplied: 0,
          sessionType: 'standard',
          source: 'calendly_webhook',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
    } else if (event === 'invitee.canceled') {
      const eventUri = payload.event || payload.scheduled_event
      const uri = eventUri || payload?.cancellation?.event
      if (!uri) {
        res.status(400).send('Missing event uri')
        return
      }
      const snap = await db.collection('bookings').where('eventUri', '==', uri).limit(25).get()
      const batch = db.batch()
      snap.docs.forEach((doc) => {
        batch.update(doc.ref, { status: 'cancelled' })
      })
      await batch.commit()
    }

    res.status(200).json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e?.message || 'error' })
  }
})

/**
 * Callable: permanently delete the authenticated user's account and associated data.
 * Client must re-authenticate before calling (Firebase Auth recent sign-in).
 */
exports.deleteAccount = functions.https.onCall(async (_data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to delete your account.')
  }

  const uid = context.auth.uid
  const email = context.auth.token?.email || null

  if (await isUserAdmin(db, uid, email)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Admin accounts cannot be deleted through the app. Contact support.'
    )
  }

  try {
    await deleteUserData(db, uid, email)
    await admin.auth().deleteUser(uid)
    return {
      success: true,
      message:
        'Your account has been deleted. Some transaction records may be retained as required by law.',
    }
  } catch (e) {
    console.error('deleteAccount failed', uid, e)
    throw new functions.https.HttpsError(
      'internal',
      e?.message || 'Account deletion failed. Please try again or contact support.'
    )
  }
})
