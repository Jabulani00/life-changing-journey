/**
 * Single source for plan pricing, discounts, session caps, priority, and operating hours.
 * UI and hooks must import from here (or subscriptionConfig re-exports) — no literals in components.
 */

/** @typedef {'silver'|'gold'|'platinum'} PlanId */
/** @typedef {'children'|'adults'|'couples'} PlanCategory */

export const PLAN_ID = {
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
}

const ALL_PLANS = [PLAN_ID.SILVER, PLAN_ID.GOLD, PLAN_ID.PLATINUM]

export function isValidPlanId(value) {
  return typeof value === 'string' && ALL_PLANS.includes(value)
}

/** Once-off pricing (ZAR) by tier × category */
export const PRICING_ZAR = {
  [PLAN_ID.SILVER]: { children: 100, adults: 100, couples: 100 },
  [PLAN_ID.GOLD]: { children: 199, adults: 299, couples: 499 },
  [PLAN_ID.PLATINUM]: { children: 399, adults: 599, couples: 899 },
}

/** Discount at checkout / booking (percentage) */
export const DISCOUNTS = {
  [PLAN_ID.SILVER]: 0,
  [PLAN_ID.GOLD]: 10,
  [PLAN_ID.PLATINUM]: 20,
}

/** Session limits per calendar month */
export const SESSION_LIMITS = {
  coachingSessions: { [PLAN_ID.GOLD]: 1, [PLAN_ID.PLATINUM]: 1 },
  meditationSessions: { [PLAN_ID.PLATINUM]: 1 },
  weeklyProgressSessions: { [PLAN_ID.PLATINUM]: 4 },
}

/** Admin queue: higher first */
export const PRIORITY = {
  [PLAN_ID.SILVER]: 0,
  [PLAN_ID.GOLD]: 1,
  [PLAN_ID.PLATINUM]: 2,
}

/** Local time window for booking UI (non–24hr tiers) — hours 0–23 */
export const OPERATING_HOURS = {
  start: 8,
  end: 18,
}

export function getDiscountPercentForPlan(planId) {
  if (!planId || !isValidPlanId(planId)) return 0
  return DISCOUNTS[planId] ?? 0
}

export function getPriorityScoreForPlan(planId) {
  if (!planId || !isValidPlanId(planId)) return 0
  return PRIORITY[planId] ?? 0
}

/** Mirrors subscriptionConfig BOOKING_CATEGORY keys for session limit queries */
export const SESSION_TYPE = {
  COACHING: 'coaching',
  MEDITATION: 'meditation',
  WEEKLY_PROGRESS: 'weekly_progress',
  STANDARD: 'standard',
}
