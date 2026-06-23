/**
 * Firebase (Firestore + Auth) - real implementation.
 * Same insert pattern as createBooking, addEvent: write to Firestore. Auth via Firebase Auth.
 */
import { getApp, initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth as getFirebaseAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'

let _app = null
let _db = null
let _auth = null

function getFirebaseApp() {
  if (_app) return _app
  try {
    _app = getApp()
  } catch {
    _app = initializeApp(firebaseConfig)
  }
  return _app
}

function getDb() {
  if (_db) return _db
  _db = getFirestore(getFirebaseApp())
  if (__DEV__) {
    console.log('[Firebase] Firestore connected, project:', firebaseConfig.projectId)
  }
  return _db
}

function getAuth() {
  if (_auth) return _auth
  _auth = getFirebaseAuth(getFirebaseApp())
  return _auth
}

export { getDb, getAuth }

export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  EVENTS: 'events',
  CONFIG: 'config',
  CONTACTS: 'contacts',
  MOTIVATIONS: 'motivations',
  USERS: 'users',
  /** Same collection as membership-web; doc id = Firebase Auth uid */
  USER_MEMBERSHIPS: 'user_memberships',
  /** Staff follow-ups / call reminders keyed by auto id */
  STAFF_TASKS: 'staff_tasks',
}

export async function createBooking(data) {
  const userId = data.userId
  let membershipTier = null
  let memberType = 'standard'
  let isPriority = false

  if (userId) {
    try {
      const memRef = doc(getDb(), COLLECTIONS.USER_MEMBERSHIPS, userId)
      const memSnap = await getDoc(memRef)
      if (memSnap.exists()) {
        const mem = memSnap.data()
        const isActive = mem.status === 'active' && (!mem.endAt || new Date(mem.endAt) > new Date())
        if (isActive && mem.planId) {
          membershipTier = mem.planId
          memberType = mem.memberType || mem.planId
          isPriority = mem.planId === 'gold' || mem.planId === 'platinum'
        }
      }
    } catch (_) {}
  }

  const ref = await addDoc(collection(getDb(), COLLECTIONS.BOOKINGS), {
    ...data,
    status: data.status || 'pending',
    membershipTier,
    memberType,
    isPriority,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data, membershipTier, memberType, isPriority }
}

const TIER_ORDER = { platinum: 0, gold: 1, silver: 2 }
function tierRank(tier) {
  return TIER_ORDER[tier] ?? 99
}

/**
 * Subscribe to Firestore users/{uid} for profile fields including `plan`.
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeUserProfile(uid, onData, onError) {
  if (!uid) {
    onData(null)
    return () => {}
  }
  const ref = doc(getDb(), COLLECTIONS.USERS, uid)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) onData(null)
      else {
        const d = snap.data()
        onData({
          id: uid,
          ...d,
          createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? d.createdAt,
        })
      }
    },
    onError
  )
}

/**
 * Merge subscription plan onto users/{uid} (kept in sync with membership tier).
 * @param {string} plan - silver | gold | platinum | null
 */
export async function mergeUserPlanField(uid, plan) {
  if (!uid) return
  const ref = doc(getDb(), COLLECTIONS.USERS, uid)
  const prevSnap = await getDoc(ref)
  const prevPlan = prevSnap.data()?.plan
  const nextPlan = plan ?? null
  const planChanged = prevPlan !== nextPlan
  await setDoc(
    ref,
    {
      plan: nextPlan,
      notificationTier: plan || 'none',
      planUpdatedAt: serverTimestamp(),
      ...(planChanged && nextPlan ? { planActivatedAt: serverTimestamp() } : {}),
    },
    { merge: true }
  )
}

/**
 * Create a staff task (call reminder, follow-up, etc.).
 * @param {{ bookingId: string, userId: string, type: string, payload?: object }} data
 */
export async function createStaffTask(data) {
  const completed = data.completed === true
  const ref = await addDoc(collection(getDb(), COLLECTIONS.STAFF_TASKS), {
    bookingId: data.bookingId,
    userId: data.userId,
    userName: data.userName ?? null,
    userEmail: data.userEmail ?? null,
    plan: data.plan ?? null,
    type: data.type,
    dueAt: data.dueAt ?? null,
    completed,
    payload: data.payload ?? null,
    status: completed ? 'done' : 'open',
    createdAt: serverTimestamp(),
  })
  return { id: ref.id }
}

/**
 * Count user's bookings in a calendar month by `bookingCategory`.
 * Uses client filter (suitable for moderate list sizes).
 */
export async function countUserMonthBookingsByCategory(userId, category, refDate = new Date()) {
  const list = await getBookings(userId, false)
  const y = refDate.getFullYear()
  const m = refDate.getMonth()
  return list.filter((b) => {
    if ((b.bookingCategory || 'standard') !== category) return false
    const created = b.createdAt ? new Date(b.createdAt) : null
    if (!created || Number.isNaN(created.getTime())) return false
    return created.getFullYear() === y && created.getMonth() === m
  }).length
}

export async function getBookings(userId, asAdmin = false) {
  const col = collection(getDb(), COLLECTIONS.BOOKINGS)
  const q = asAdmin ? col : query(col, where('userId', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => {
    const row = d.data()
    return {
      id: d.id,
      ...row,
      createdAt: row.createdAt?.toDate?.()?.toISOString?.(),
      scheduledAt: row.scheduledAt?.toDate?.()?.toISOString?.() ?? row.scheduledAt,
    }
  })

  if (asAdmin) {
    // Enrich with live membership data for any booking missing it
    const missingMembershipIds = [...new Set(
      list.filter((b) => !b.membershipTier && b.userId).map((b) => b.userId)
    )]
    if (missingMembershipIds.length > 0) {
      const memSnaps = await Promise.all(
        missingMembershipIds.map((uid) => getDoc(doc(getDb(), COLLECTIONS.USER_MEMBERSHIPS, uid)))
      )
      const memMap = {}
      memSnaps.forEach((snap) => {
        if (snap.exists()) {
          const data = snap.data()
          const isActive = data.status === 'active' && (!data.endAt || new Date(data.endAt) > new Date())
          memMap[snap.id] = isActive ? data.planId : null
        }
      })
      list.forEach((b) => {
        if (!b.membershipTier && b.userId && memMap[b.userId]) {
          b.membershipTier = memMap[b.userId]
          b.isPriority = b.membershipTier === 'gold' || b.membershipTier === 'platinum'
        }
      })
    }
    // Priority members (gold/platinum) float to top, then sort by date desc
    list.sort((a, b) => {
      const tierDiff = tierRank(a.membershipTier) - tierRank(b.membershipTier)
      if (tierDiff !== 0) return tierDiff
      return (b.scheduledAt || b.createdAt || '').localeCompare(a.scheduledAt || a.createdAt || '')
    })
  } else {
    list.sort((a, b) => {
      const pa = typeof a.priority === 'number' ? a.priority : 0
      const pb = typeof b.priority === 'number' ? b.priority : 0
      if (pb !== pa) return pb - pa
      return (b.scheduledAt || b.createdAt || '').localeCompare(a.scheduledAt || a.createdAt || '')
    })
  }

  return list
}

/**
 * Update a booking (e.g. status, date, time, notes). Admin use.
 * @param {string} bookingId - Firestore document id
 * @param {object} updates - { status?, date?, time?, notes? }
 */
export async function updateBooking(bookingId, updates) {
  const ref = doc(getDb(), COLLECTIONS.BOOKINGS, bookingId)
  const allowed = {}
  if (updates.status != null) allowed.status = updates.status
  if (updates.date != null) allowed.date = updates.date
  if (updates.time != null) allowed.time = updates.time
  if (updates.notes != null) allowed.notes = updates.notes
  if (updates.priority != null) allowed.priority = updates.priority
  if (updates.scheduledAt != null) allowed.scheduledAt = updates.scheduledAt
  if (Object.keys(allowed).length === 0) return
  await updateDoc(ref, allowed)
}

/**
 * All staff tasks (admin). Collection name: staff_tasks.
 */
export async function getStaffTasks() {
  const snap = await getDocs(collection(getDb(), COLLECTIONS.STAFF_TASKS))
  const list = snap.docs.map((d) => {
    const row = d.data()
    return {
      id: d.id,
      ...row,
      dueAt: row.dueAt?.toDate?.()?.toISOString?.() ?? row.dueAt,
      createdAt: row.createdAt?.toDate?.()?.toISOString?.() ?? row.createdAt,
    }
  })
  list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return list
}

export async function updateStaffTaskCompleted(taskId, completed) {
  const ref = doc(getDb(), COLLECTIONS.STAFF_TASKS, taskId)
  await updateDoc(ref, {
    completed: !!completed,
    status: completed ? 'done' : 'open',
  })
}

export async function getEvents() {
  const snap = await getDocs(collection(getDb(), COLLECTIONS.EVENTS))
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
  const ref = await addDoc(collection(getDb(), COLLECTIONS.EVENTS), {
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
    const ref = doc(getDb(), COLLECTIONS.CONFIG, 'admins')
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
    const ref = doc(getDb(), COLLECTIONS.CONFIG, LIVE_STREAM_CONFIG_ID)
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
  const ref = doc(getDb(), COLLECTIONS.CONFIG, LIVE_STREAM_CONFIG_ID)
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
  const ref = await addDoc(collection(getDb(), COLLECTIONS.CONTACTS), {
    name: data.name?.trim() ?? '',
    email: data.email?.trim() ?? '',
    phone: (data.phone && String(data.phone).trim()) || null,
    subject: data.subject?.trim() ?? '',
    message: data.message?.trim() ?? '',
    serviceInterest: (data.serviceInterest && String(data.serviceInterest).trim()) || null,
    priorityQueue: data.priorityQueue === true,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id }
}

/**
 * Get all motivations (quotes, scriptures, encouragement) for the Daily Motivations feed.
 * @returns {Promise<Array<{ id: string, message: string, category?: string, author?: string, createdAt?: string }>>}
 */
export async function getMotivations() {
  const snap = await getDocs(collection(getDb(), COLLECTIONS.MOTIVATIONS))
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
  const ref = await addDoc(collection(getDb(), COLLECTIONS.MOTIVATIONS), {
    message: data.message?.trim() ?? '',
    category: (data.category && String(data.category).trim()) || 'general',
    author: (data.author && String(data.author).trim()) || null,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data }
}

// —— Firebase Auth + Firestore users (same insert pattern as bookings/events) ——

/**
 * Register with email/password: creates Firebase Auth user, then saves profile to Firestore users/{uid}.
 * Same pattern as createBooking: write to Firestore after auth.
 */
export async function registerWithEmailAndPassword(email, password, fullName) {
  const auth = getAuth()
  const cred = await createUserWithEmailAndPassword(auth, (email || '').trim().toLowerCase(), password)
  const uid = cred.user.uid
  const userEmail = cred.user.email || email
  const ref = doc(getDb(), COLLECTIONS.USERS, uid)
  await setDoc(ref, {
    email: userEmail,
    full_name: (fullName || '').trim() || null,
    plan: 'silver',
    planCategory: 'adults',
    planActivatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  })
  return {
    user: {
      id: uid,
      uid,
      email: userEmail,
      user_metadata: { full_name: fullName || '', email: userEmail },
    },
    session: { user: cred.user },
  }
}

/**
 * Sign in with email/password (Firebase Auth).
 */
export async function signInWithEmail(email, password) {
  const auth = getAuth()
  const result = await signInWithEmailAndPassword(auth, (email || '').trim().toLowerCase(), password)
  return {
    user: result.user,
    session: { user: result.user },
  }
}

/**
 * Sign out (Firebase Auth).
 */
export async function signOutFirebase() {
  const auth = getAuth()
  await firebaseSignOut(auth)
}

/**
 * Subscribe to auth state changes (Firebase Auth).
 */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(getAuth(), callback)
}

/**
 * Get user profile from Firestore users/{uid}. Same read pattern as getBookings/getEvents.
 */
export async function getUserProfileFromFirestore(uid) {
  const ref = doc(getDb(), COLLECTIONS.USERS, uid)
  const snap = await getDoc(ref)
  const data = snap.data()
  return data ? { id: uid, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt } : null
}

/**
 * Update user profile in Firestore users/{uid}. Same pattern as updateBooking.
 */
export async function updateUserProfileInFirestore(uid, updates) {
  const ref = doc(getDb(), COLLECTIONS.USERS, uid)
  const allowed = { updatedAt: serverTimestamp() }
  if (updates.full_name != null) allowed.full_name = updates.full_name
  if (updates.phone != null) allowed.phone = updates.phone
  if (updates.date_of_birth != null) allowed.date_of_birth = updates.date_of_birth
  if (updates.plan !== undefined) allowed.plan = updates.plan
  if (updates.planCategory !== undefined) allowed.planCategory = updates.planCategory
  if (updates.isAdmin !== undefined) allowed.isAdmin = updates.isAdmin
  if (updates.notificationTier !== undefined) allowed.notificationTier = updates.notificationTier
  await updateDoc(ref, allowed)
}
