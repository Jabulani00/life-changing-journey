/**
 * Admin service – single entry point for all admin Firebase operations.
 * Use this in AdminScreen, AdminDashboardScreen, and any other admin pages
 * so saves go through one layer (error handling, validation, Firebase calls).
 */
import {
  addEvent as fbAddEvent,
  addMotivation as fbAddMotivation,
  getBookings,
  getEvents,
  getLiveStreamConfig,
  getMotivations,
  setLiveStreamConfig as fbSetLiveStreamConfig,
  updateBooking as fbUpdateBooking,
} from './firebase'

const FIREBASE_NOT_CONNECTED =
  'Firebase is not connected. Run: npm install firebase and ensure firebase.js uses the real implementation (see FIREBASE_SETUP.md).'
const PERMISSION_HINT =
  'In Firebase Console → Firestore → Rules, allow write on the collection or use test mode (see FIREBASE_SETUP.md).'

function wrapAdminOp(fn, collectionLabel) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (e) {
      const msg = e?.message || String(e)
      const isPermission =
        msg.includes('permission') ||
        msg.includes('PERMISSION_DENIED') ||
        e?.code === 'permission-denied'
      const isMissing =
        msg.includes('cannot be saved') ||
        msg.includes('Firebase is not connected')
      let userMsg = msg
      if (isPermission) userMsg = `${msg}\n\n${PERMISSION_HINT}`
      if (isMissing) userMsg = `${msg}\n\n${FIREBASE_NOT_CONNECTED}`
      const err = new Error(userMsg)
      err.code = e?.code
      err.original = e
      throw err
    }
  }
}

// —— Events ——
export async function adminGetEvents() {
  return wrapAdminOp(getEvents)()
}

export async function adminAddEvent(data) {
  const payload = {
    title: data.title?.trim() ?? '',
    description: (data.description && String(data.description).trim()) || null,
    date: (data.date && String(data.date).trim()) || new Date().toISOString(),
    location: (data.location && String(data.location).trim()) || null,
  }
  if (!payload.title) {
    throw new Error('Event title is required.')
  }
  return wrapAdminOp(fbAddEvent)(payload)
}

// —— Bookings (admin: all bookings + update) ——
export async function adminGetAllBookings() {
  return wrapAdminOp(getBookings)(null, true)
}

export async function adminUpdateBooking(bookingId, updates) {
  if (!bookingId) throw new Error('Booking ID is required.')
  const allowed = {}
  if (updates.status != null) allowed.status = updates.status
  if (updates.date != null) allowed.date = updates.date
  if (updates.time != null) allowed.time = updates.time
  if (updates.notes != null) allowed.notes = updates.notes
  if (Object.keys(allowed).length === 0) return
  return wrapAdminOp(fbUpdateBooking)(bookingId, allowed)
}

// —— Motivations ——
export async function adminGetMotivations() {
  return wrapAdminOp(getMotivations)()
}

export async function adminAddMotivation(data) {
  const message = (data.message && String(data.message).trim()) || ''
  if (!message) throw new Error('Motivational message is required.')
  const payload = {
    message,
    category: (data.category && String(data.category).trim()) || 'general',
    author: (data.author && String(data.author).trim()) || null,
  }
  return wrapAdminOp(fbAddMotivation)(payload)
}

// —— Live stream config ——
export async function adminGetLiveStreamConfig() {
  return wrapAdminOp(getLiveStreamConfig)()
}

export async function adminSetLiveStreamConfig(config) {
  const payload = {
    youtubeUrl: (config.youtubeUrl && String(config.youtubeUrl).trim()) || null,
    facebookUrl: (config.facebookUrl && String(config.facebookUrl).trim()) || null,
  }
  return wrapAdminOp(fbSetLiveStreamConfig)(payload)
}
