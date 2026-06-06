/**
 * Plan identifiers, booking categories, and helpers.
 * Numeric caps and discounts are defined in constants/planConfig.js.
 */
import {
  DISCOUNTS,
  PLAN_ID,
  PRIORITY,
  SESSION_LIMITS as PLAN_SESSION_LIMITS,
  getDiscountPercentForPlan,
  getPriorityScoreForPlan,
  isValidPlanId,
} from '../constants/planConfig'

export { PLAN_ID, isValidPlanId, getDiscountPercentForPlan, getPriorityScoreForPlan }

/** Checkout discount (percentage 0–100) — from planConfig */
export const DISCOUNT_PERCENT_BY_PLAN = DISCOUNTS

/** Admin queue ordering — from planConfig */
export const PRIORITY_SCORE_BY_PLAN = PRIORITY

/**
 * Session caps per month (legacy shape used by BookingScreen / bookingService).
 * Silver: 0 for premium session types; Gold/Platinum from planConfig SESSION_LIMITS.
 */
export const SESSION_LIMITS = {
  coachingPerMonth: {
    [PLAN_ID.SILVER]: 0,
    [PLAN_ID.GOLD]: PLAN_SESSION_LIMITS.coachingSessions[PLAN_ID.GOLD] ?? 0,
    [PLAN_ID.PLATINUM]: PLAN_SESSION_LIMITS.coachingSessions[PLAN_ID.PLATINUM] ?? 0,
  },
  meditationPerMonth: {
    [PLAN_ID.SILVER]: 0,
    [PLAN_ID.GOLD]: 0,
    [PLAN_ID.PLATINUM]: PLAN_SESSION_LIMITS.meditationSessions[PLAN_ID.PLATINUM] ?? 0,
  },
  weeklyProgressPerMonth: {
    [PLAN_ID.SILVER]: 0,
    [PLAN_ID.GOLD]: 0,
    [PLAN_ID.PLATINUM]: PLAN_SESSION_LIMITS.weeklyProgressSessions[PLAN_ID.PLATINUM] ?? 0,
  },
}

/** Booking payload `bookingCategory` / Firestore `sessionType` values */
export const BOOKING_CATEGORY = {
  STANDARD: 'standard',
  COACHING: 'coaching',
  MEDITATION: 'meditation',
  WEEKLY_PROGRESS: 'weekly_progress',
}

export const PLAN_DISPLAY_NAME = {
  [PLAN_ID.SILVER]: 'Silver',
  [PLAN_ID.GOLD]: 'Gold',
  [PLAN_ID.PLATINUM]: 'Platinum',
}
