/**
 * Membership + entitlements — same Firestore shape as membership-web (`user_memberships/{uid}`).
 * Entitlement mapping mirrors membership-web/src/lib/entitlements.ts.
 */
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { COLLECTIONS, getDb } from './firebase'

const EMPTY = {
  priorityBooking: false,
  contentLibrary: false,
  weeklyTips: false,
  privateCommunity: false,
  guidedMeditation: false,
  prioritySupport: false,
}

/** Human-readable labels for dashboard-style entitlement rows (order matches web). */
export const ENTITLEMENT_LABELS = {
  priorityBooking: 'Priority booking',
  contentLibrary: 'Content library access',
  weeklyTips: 'Weekly motivation & mental health tips',
  privateCommunity: 'Private community support',
  guidedMeditation: 'Guided meditation sessions',
  prioritySupport: 'Priority support & response',
}

/**
 * Same rules as web GET /api/me/entitlements, plus optional expiry if endAt is in the past.
 * @param {string | undefined} planId
 * @returns {typeof EMPTY}
 */
export function mapPlanToEntitlements(planId) {
  if (!planId) return { ...EMPTY }

  if (planId === 'silver') {
    return { ...EMPTY }
  }

  if (planId === 'gold') {
    return {
      ...EMPTY,
      priorityBooking: true,
      contentLibrary: true,
      weeklyTips: true,
    }
  }

  return {
    ...EMPTY,
    priorityBooking: true,
    contentLibrary: true,
    weeklyTips: true,
    privateCommunity: true,
    guidedMeditation: true,
    prioritySupport: true,
  }
}

/**
 * @param {{ status?: string, endAt?: string, planId?: string } | null | undefined} membership
 * @returns {string | null} plan id if membership unlocks app features
 */
export function getEffectivePlanId(membership) {
  if (!membership || membership.status !== 'active') return null
  if (membership.endAt) {
    const end = new Date(membership.endAt)
    if (!Number.isNaN(end.getTime()) && end < new Date()) return null
  }
  return membership.planId || null
}

export async function getMembership(userId) {
  if (!userId) return null
  const ref = doc(getDb(), COLLECTIONS.USER_MEMBERSHIPS, userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data()
}

/**
 * Real-time membership doc (same as web dashboard source).
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeMembership(userId, onData, onError) {
  if (!userId) {
    onData(null)
    return () => {}
  }
  const ref = doc(getDb(), COLLECTIONS.USER_MEMBERSHIPS, userId)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) onData(null)
      else onData(snap.data())
    },
    onError
  )
}
