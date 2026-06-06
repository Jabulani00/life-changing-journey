import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { PRICING_ZAR, PLAN_ID } from '../constants/planConfig'
import { PLAN_DISPLAY_NAME } from '../config/subscriptionConfig'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { mergeUserPlanField, updateUserProfileInFirestore } from '../services/firebase'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'

const MEMBER_TYPES = [
  { id: 'children', label: 'Children' },
  { id: 'adults', label: 'Adults' },
  { id: 'couples', label: 'Couples' },
]

const FEATURE_ROWS = [
  { key: 'hasPriorityBooking', label: 'Priority booking' },
  { key: 'hasImmediateResponse', label: 'Faster response' },
  { key: 'hasDiscount', label: 'Member discount' },
  { key: 'hasBookingReminders', label: 'Booking reminders' },
  { key: 'hasProgressTracking', label: 'Progress tracking' },
  { key: 'hasContentLibrary', label: 'Content library' },
  { key: 'hasCoachingSessions', label: 'Coaching sessions' },
  { key: 'hasWeeklyTips', label: 'Weekly tips' },
  { key: 'hasCallReminders', label: 'Call reminders' },
  { key: 'hasPrivateCommunity', label: 'Private community' },
  { key: 'hasMeditationSessions', label: 'Meditation sessions' },
  { key: 'hasWeeklyProgressSessions', label: 'Weekly progress sessions' },
  { key: 'has24hrAccess', label: '24-hour booking access' },
  { key: 'hasAllBusinessContent', label: 'Full business content' },
]

const TIER_ORDER = [PLAN_ID.SILVER, PLAN_ID.GOLD, PLAN_ID.PLATINUM]

const BADGE = {
  [PLAN_ID.SILVER]: { bg: 'rgba(113,128,150,0.15)', border: Colors.lightGray, fg: Colors.textSecondary },
  [PLAN_ID.GOLD]: { bg: Colors.accent + '22', border: Colors.accent, fg: Colors.accentDark },
  [PLAN_ID.PLATINUM]: { bg: '#5B21B633', border: '#5B21B6', fg: '#5B21B6' },
}

export default function SubscriptionScreen({ navigation }) {
  const { user } = useAuth()
  const sub = useSubscription()
  const [memberType, setMemberType] = useState(sub.profile?.planCategory || 'adults')
  const [saving, setSaving] = useState(false)

  const uid = user?.uid || user?.id
  const current = sub.plan ?? PLAN_ID.SILVER

  const prices = useMemo(() => {
    const row = {}
    TIER_ORDER.forEach((tid) => {
      row[tid] = PRICING_ZAR[tid]?.[memberType] ?? PRICING_ZAR[tid]?.adults
    })
    return row
  }, [memberType])

  const handleSelectPlan = async (planId) => {
    if (!uid || user?.isAnonymous) {
      Alert.alert('Sign in required', 'Create an account to manage your plan.')
      return
    }
    if (planId === current) return
    setSaving(true)
    try {
      await updateUserProfileInFirestore(uid, { plan: planId, planCategory: memberType })
      await mergeUserPlanField(uid, planId)
      Alert.alert('Plan updated', `You are now on ${PLAN_DISPLAY_NAME[planId]}.`)
    } catch (e) {
      Alert.alert('Could not update', e?.message || 'Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 48, paddingBottom: 20, paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack?.()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.white, marginLeft: 8 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ ...Typography.textStyles.h3, color: Colors.white }}>Subscription</Text>
        <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.white, opacity: 0.9, marginTop: 6 }}>
          Pricing from your plan configuration (ZAR).
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginBottom: 8 }}>
          Member category
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {MEMBER_TYPES.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setMemberType(m.id)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: memberType === m.id ? Colors.primary : Colors.lightGray,
                backgroundColor: memberType === m.id ? Colors.primaryAlpha : Colors.surface,
              }}
            >
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary }}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          {TIER_ORDER.map((tid) => {
            const theme = BADGE[tid]
            const isCurrent = current === tid
            return (
              <View
                key={tid}
                style={{
                  flex: 1,
                  minWidth: 100,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: isCurrent ? Colors.primary : theme.border,
                  backgroundColor: Colors.surface,
                  padding: 12,
                }}
              >
                <Text style={{ ...Typography.textStyles.captionBold, color: theme.fg, marginBottom: 4 }}>
                  {PLAN_DISPLAY_NAME[tid]}
                </Text>
                <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, marginBottom: 8 }}>
                  R{Number(prices[tid]).toLocaleString('en-ZA')}
                </Text>
                {isCurrent ? (
                  <View style={{ backgroundColor: Colors.primaryAlpha, borderRadius: 8, padding: 6 }}>
                    <Text style={{ ...Typography.textStyles.captionBold, color: Colors.primary, textAlign: 'center' }}>
                      Current
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={saving}
                    onPress={() => handleSelectPlan(tid)}
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 8,
                      paddingVertical: 8,
                      alignItems: 'center',
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    <Text style={{ ...Typography.textStyles.captionBold, color: Colors.white }}>Select</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          })}
        </View>

        <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary, marginTop: 28, marginBottom: 10 }}>
          What is included
        </Text>
        {FEATURE_ROWS.map((row) => {
          const has = sub[row.key]
          return (
            <View
              key={row.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: Colors.lightGray,
              }}
            >
              <Ionicons
                name={has ? 'checkmark-circle' : 'lock-closed'}
                size={20}
                color={has ? Colors.success : Colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  ...Typography.textStyles.bodySmall,
                  color: has ? Colors.textPrimary : Colors.textMuted,
                  flex: 1,
                }}
              >
                {row.label}
              </Text>
            </View>
          )
        })}

        <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 24, lineHeight: 18 }}>
          This platform provides guidance and support. It does not replace professional medical or psychiatric diagnosis.
          Financial services are subject to responsible lending practices.
        </Text>
      </ScrollView>
    </View>
  )
}
