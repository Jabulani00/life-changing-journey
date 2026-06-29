/**
 * Subscription tier: `user_memberships/{uid}` (active) + `users/{uid}.plan` mirror.
 * useSubscription() — plan values from constants/planConfig via subscriptionConfig.
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  PLAN_ID,
  getDiscountPercentForPlan,
  getPriorityScoreForPlan,
} from '../config/subscriptionConfig'
import { useAuth } from './AuthContext'
import { mergeUserPlanField, subscribeUserProfile } from '../services/firebase'
import { getEffectivePlanId, subscribeMembership } from '../services/membershipService'

const SubscriptionContext = createContext(null)

function deriveBooleans(plan) {
  if (!plan) {
    return {
      plan: null,
      hasActiveSubscription: false,
      isSilver: false,
      isGold: false,
      isPlatinum: false,
      discountRate: 0,
      bookingPriority: 0,
      hasPriorityBooking: false,
      hasImmediateResponse: false,
      hasDiscount: false,
      hasBookingReminders: false,
      hasProgressTracking: false,
      hasContentLibrary: false,
      hasCoachingSessions: false,
      hasWeeklyTips: false,
      hasCallReminders: false,
      hasPrivateCommunity: false,
      hasMeditationSessions: false,
      hasWeeklyProgressSessions: false,
      has24hrAccess: false,
      hasAllBusinessContent: false,
      hasGuaranteedFollowUp: false,
    }
  }

  const p = plan
  const isSilver = p === PLAN_ID.SILVER
  const isGold = p === PLAN_ID.GOLD
  const isPlatinum = p === PLAN_ID.PLATINUM
  const hasActiveSubscription = true

  return {
    plan: p,
    hasActiveSubscription,
    isSilver,
    isGold,
    isPlatinum,
    discountRate: getDiscountPercentForPlan(p),
    bookingPriority: getPriorityScoreForPlan(p),
    hasPriorityBooking: isGold || isPlatinum,
    hasImmediateResponse: isGold || isPlatinum,
    hasBookingReminders: isGold || isPlatinum,
    hasCallReminders: isPlatinum,
    hasDiscount: isGold || isPlatinum,
    hasProgressTracking: isGold || isPlatinum,
    hasContentLibrary: isGold || isPlatinum,
    hasCoachingSessions: isGold || isPlatinum,
    hasWeeklyTips: isGold || isPlatinum,
    hasPrivateCommunity: isPlatinum,
    hasMeditationSessions: isPlatinum,
    hasWeeklyProgressSessions: isPlatinum,
    has24hrAccess: isPlatinum,
    hasAllBusinessContent: isPlatinum,
    hasGuaranteedFollowUp: isPlatinum,
  }
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || user?.id
  const isGuest = !user || user?.isAnonymous
  const isDemo = user?.id === 'demo-admin'

  const [membership, setMembership] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const lastMergedPlan = useRef(undefined)

  useEffect(() => {
    if (!uid || isGuest || isDemo) {
      setMembership(null)
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubMem = subscribeMembership(
      uid,
      (data) => {
        setMembership(data)
        setLoading(false)
      },
      () => {
        setMembership(null)
        setLoading(false)
      }
    )
    const unsubProf = subscribeUserProfile(
      uid,
      (data) => {
        setProfile(data)
        setLoading(false)
      },
      () => {
        setProfile(null)
        setLoading(false)
      }
    )
    return () => {
      unsubMem()
      unsubProf()
    }
  }, [uid, isGuest, isDemo])

  const plan = useMemo(() => {
    if (!uid || isGuest || isDemo) return null
    return getEffectivePlanId(membership)
  }, [uid, isGuest, isDemo, membership])

  useEffect(() => {
    if (!uid || isGuest || isDemo) return
    const fromMem = getEffectivePlanId(membership)
    if (!fromMem) return
    if (fromMem === lastMergedPlan.current) return
    lastMergedPlan.current = fromMem
    mergeUserPlanField(uid, fromMem).catch(() => {})
  }, [uid, isGuest, isDemo, membership])

  const value = useMemo(() => {
    const flags = deriveBooleans(plan)
    return {
      ...flags,
      loading,
      membership,
      profile,
      needsSubscription: false,
    }
  }, [plan, loading, membership, profile, uid, isGuest, isDemo])

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return ctx
}

export function useSubscriptionOptional() {
  return useContext(SubscriptionContext)
}
