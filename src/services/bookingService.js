/**
 * Firestore booking + staff task helpers (Calendly + legacy bookings).
 */
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { BOOKING_CATEGORY } from '../config/subscriptionConfig'
import {
  COLLECTIONS,
  createStaffTask as createStaffTaskFb,
  getBookings,
  getDb,
  updateBooking,
} from './firebase'

/**
 * @param {string} userId
 * @param {object} user - { email, displayName?, user_metadata? }
 * @param {object} calendlyPayload - event_scheduled payload or { payload: {...} }
 * @param {object} subscriptionData - { plan, planCategory, priority, discountRate, sessionType? }
 */
export async function saveBooking(userId, user, calendlyPayload, subscriptionData) {
  const raw = calendlyPayload?.payload != null ? calendlyPayload.payload : calendlyPayload
  const ev = raw?.event
  const inv = raw?.invitee

  const eventUri = typeof ev === 'string' ? ev : ev?.uri || ''
  const inviteeUri =
    typeof inv === 'string' ? inv : inv?.uri || ''

  const startTime =
    (typeof ev === 'object' && ev?.start_time) || raw?.start_time || null

  let scheduledAt = null
  if (startTime) {
    const d = new Date(startTime)
    if (!Number.isNaN(d.getTime())) {
      scheduledAt = Timestamp.fromDate(d)
    }
  }

  const email =
    user?.email ||
    user?.user_metadata?.email ||
    (typeof inv === 'object' && inv?.email) ||
    ''
  const userName =
    (typeof inv === 'object' && (inv?.name || [inv?.first_name, inv?.last_name].filter(Boolean).join(' '))) ||
    user?.user_metadata?.full_name ||
    user?.displayName ||
    ''

  const plan = subscriptionData?.plan ?? 'silver'
  const planCategory = subscriptionData?.planCategory ?? 'adults'
  const priority = typeof subscriptionData?.priority === 'number' ? subscriptionData.priority : 0
  const discountRate = typeof subscriptionData?.discountRate === 'number' ? subscriptionData.discountRate : 0
  const sessionType = subscriptionData?.sessionType || BOOKING_CATEGORY.STANDARD

  const ref = await addDoc(collection(getDb(), COLLECTIONS.BOOKINGS), {
    userId,
    userEmail: email,
    userName: userName || email || 'Member',
    plan,
    planCategory,
    priority,
    eventUri,
    inviteeUri,
    scheduledAt: scheduledAt || serverTimestamp(),
    status: 'confirmed',
    discountApplied: discountRate,
    sessionType,
    source: 'calendly',
    createdAt: serverTimestamp(),
  })
  return { id: ref.id }
}

/**
 * @param {'call_reminder'|'follow_up'} type
 */
export async function createStaffTask(type, bookingId, userId, userName, userEmail, plan, dueAt) {
  let due = null
  if (dueAt instanceof Date && !Number.isNaN(dueAt.getTime())) {
    due = Timestamp.fromDate(dueAt)
  } else if (dueAt?.seconds) {
    due = dueAt
  }
  return createStaffTaskFb({
    type,
    bookingId,
    userId,
    userName,
    userEmail,
    plan,
    dueAt: due,
  })
}

/**
 * Count bookings this calendar month for session limit enforcement.
 * @param {string} userId
 * @param {string} sessionType - e.g. BOOKING_CATEGORY.COACHING
 */
export async function getUserBookingsThisMonth(userId, sessionType, refDate = new Date()) {
  if (!userId) return 0
  const list = await getBookings(userId, false)
  const y = refDate.getFullYear()
  const m = refDate.getMonth()
  const st = sessionType || BOOKING_CATEGORY.STANDARD
  return list.filter((b) => {
    const cat = b.sessionType || b.bookingCategory || BOOKING_CATEGORY.STANDARD
    if (cat !== st) return false
    const created = b.createdAt ? new Date(b.createdAt) : null
    if (!created || Number.isNaN(created.getTime())) return false
    return created.getFullYear() === y && created.getMonth() === m
  }).length
}

export async function cancelBooking(bookingId) {
  await updateBooking(bookingId, { status: 'cancelled' })
}
