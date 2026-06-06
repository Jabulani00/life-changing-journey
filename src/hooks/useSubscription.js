/**
 * Plan tier and entitlements for gating (Silver / Gold / Platinum).
 * Backed by SubscriptionContext + user_memberships + users/{uid}.plan — values from constants/planConfig.
 *
 * Exposes: plan, isSilver…isPlatinum, has* booleans, bookingPriority, discountRate, loading, profile, membership.
 */
export { useSubscription, useSubscriptionOptional } from '../context/SubscriptionContext'
