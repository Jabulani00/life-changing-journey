/**
 * Firebase (Firestore) - real implementation.
 * Used when "firebase" is installed. See firebase.js (stub) when it is not.
 * Lazy init so Metro/bundler doesn't run Firebase at load time (avoids 500 on web).
 */
import { initializeApp } from 'firebase/app'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'

let _db = null
function getDb() {
  if (_db) return _db
  const app = initializeApp(firebaseConfig)
  _db = getFirestore(app)
  return _db
}
export const db = new Proxy({}, {
  get(_, prop) {
    return getDb()[prop]
  },
})

export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  EVENTS: 'events',
  CONFIG: 'config',
  CONTACTS: 'contacts',
  MOTIVATIONS: 'motivations',
}

export async function createBooking(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
    ...data,
    status: data.status || 'pending',
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data }
}

export async function getBookings(userId, asAdmin = false) {
  const col = collection(db, COLLECTIONS.BOOKINGS)
  const q = asAdmin ? col : query(col, where('userId', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString?.(),
  }))
  list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return list
}

/**
 * Update a booking (e.g. status, date, time, notes). Admin use.
 * @param {string} bookingId - Firestore document id
 * @param {object} updates - { status?, date?, time?, notes? }
 */
export async function updateBooking(bookingId, updates) {
  const ref = doc(db, COLLECTIONS.BOOKINGS, bookingId)
  const allowed = {}
  if (updates.status != null) allowed.status = updates.status
  if (updates.date != null) allowed.date = updates.date
  if (updates.time != null) allowed.time = updates.time
  if (updates.notes != null) allowed.notes = updates.notes
  if (Object.keys(allowed).length === 0) return
  await updateDoc(ref, allowed)
}

export async function getEvents() {
  const snap = await getDocs(collection(db, COLLECTIONS.EVENTS))
  const list = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
      date: data.date?.toDate?.()?.toISOString?.() ?? data.date,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
    }
  })
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  return list
}

export async function addEvent(data) {
  const eventDate = data.date ? new Date(data.date) : new Date()
  const ref = await addDoc(collection(db, COLLECTIONS.EVENTS), {
    title: data.title,
    description: data.description || null,
    location: data.location || null,
    date: eventDate,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data }
}

// Default admin email (always recognized as admin if no Firestore config)
const DEFAULT_ADMIN_EMAIL = 'life.changing@admin.com'

export async function isAdmin(email) {
  if (!email) return false
  const normalized = (email.toLowerCase && email.toLowerCase()) || String(email)
  // Default admin emails from env (comma-separated) when Firestore has none
  const envAdmins = (process.env.EXPO_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const builtInAdmins = [DEFAULT_ADMIN_EMAIL.toLowerCase()]
  try {
    const ref = doc(db, COLLECTIONS.CONFIG, 'admins')
    const snap = await getDoc(ref)
    const emails = snap.data()?.emails ?? []
    const list = Array.isArray(emails) && emails.length > 0
      ? emails.map((e) => (e && e.toLowerCase && e.toLowerCase()) || String(e))
      : [...builtInAdmins, ...envAdmins]
    return list.includes(normalized)
  } catch {
    return builtInAdmins.includes(normalized) || (envAdmins.length > 0 && envAdmins.includes(normalized))
  }
}

const LIVE_STREAM_CONFIG_ID = 'liveStream'

/**
 * Get live stream config (YouTube and Facebook URLs) for in-app conferences.
 * @returns {{ youtubeUrl?: string, facebookUrl?: string, updatedAt?: string }}
 */
export async function getLiveStreamConfig() {
  try {
    const ref = doc(db, COLLECTIONS.CONFIG, LIVE_STREAM_CONFIG_ID)
    const snap = await getDoc(ref)
    const data = snap.data() || {}
    return {
      youtubeUrl: data.youtubeUrl && String(data.youtubeUrl).trim() ? data.youtubeUrl.trim() : null,
      facebookUrl: data.facebookUrl && String(data.facebookUrl).trim() ? data.facebookUrl.trim() : null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt ?? null,
    }
  } catch {
    return { youtubeUrl: null, facebookUrl: null, updatedAt: null }
  }
}

/**
 * Set live stream URLs (admin). Creates or overwrites config/liveStream.
 * @param {{ youtubeUrl?: string, facebookUrl?: string }} config
 */
export async function setLiveStreamConfig(config) {
  const ref = doc(db, COLLECTIONS.CONFIG, LIVE_STREAM_CONFIG_ID)
  await setDoc(ref, {
    youtubeUrl: (config.youtubeUrl && String(config.youtubeUrl).trim()) || null,
    facebookUrl: (config.facebookUrl && String(config.facebookUrl).trim()) || null,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

/**
 * Save contact form submission to Firestore (contacts collection).
 * @param {object} data - { name, email, phone?, subject, message, serviceInterest? }
 */
export async function submitContactForm(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
    name: data.name?.trim() ?? '',
    email: data.email?.trim() ?? '',
    phone: (data.phone && String(data.phone).trim()) || null,
    subject: data.subject?.trim() ?? '',
    message: data.message?.trim() ?? '',
    serviceInterest: (data.serviceInterest && String(data.serviceInterest).trim()) || null,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id }
}

/**
 * Get all motivations (quotes, scriptures, encouragement) for the Daily Motivations feed.
 * @returns {Promise<Array<{ id: string, message: string, category?: string, author?: string, createdAt?: string }>>}
 */
export async function getMotivations() {
  const snap = await getDocs(collection(db, COLLECTIONS.MOTIVATIONS))
  const list = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
    }
  })
  list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return list
}

/**
 * Add a motivation (admin). Used by AdminScreen Motivations tab.
 * @param {object} data - { message, category?, author? }
 */
export async function addMotivation(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.MOTIVATIONS), {
    message: data.message?.trim() ?? '',
    category: (data.category && String(data.category).trim()) || 'general',
    author: (data.author && String(data.author).trim()) || null,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data }
}
