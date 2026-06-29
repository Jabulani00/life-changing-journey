import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { PLAN_DISPLAY_NAME } from '../config/subscriptionConfig'
import { useSubscription } from '../hooks/useSubscription'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'
import { Constants } from '../utils/constants'

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

export default function SubscriptionScreen({ navigation }) {
  const sub = useSubscription()

  const current = sub.plan
  const plansUrl = `${Constants.PUBLIC_SITE_URL}/plans`

  const openWebPlans = () => {
    Linking.openURL(plansUrl).catch(() => {
      Alert.alert('Unable to open link', 'Please visit our website to manage membership.')
    })
  }

  const tierLabel = current ? PLAN_DISPLAY_NAME[current] : 'No active plan'

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
        <Text style={{ ...Typography.textStyles.h3, color: Colors.white }}>Your membership</Text>
        <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.white, opacity: 0.9, marginTop: 6 }}>
          Plan status synced from your account. Purchase or change plans on our website.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textSecondary }}>Current plan</Text>
          <Text style={{ ...Typography.textStyles.h4, color: Colors.textPrimary, marginTop: 4 }}>{tierLabel}</Text>
          {sub.membership?.endAt ? (
            <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 6 }}>
              Valid to {new Date(sub.membership.endAt).toLocaleDateString('en-ZA')}
            </Text>
          ) : null}
          {!current ? (
            <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginTop: 10 }}>
              No active membership found for this account. Sign in with the email you used on our website, then
              complete purchase there to unlock app benefits.
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={openWebPlans}
            style={{
              marginTop: 14,
              backgroundColor: Colors.primary,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>Manage on website</Text>
          </TouchableOpacity>
        </View>

        {current ? (
          <>
            <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary, marginBottom: 10 }}>
              Included in your plan
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
          </>
        ) : null}

        <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 24, lineHeight: 18 }}>
          Membership cannot be changed inside the app. This platform provides guidance and support. It does not replace
          professional medical or psychiatric diagnosis.
        </Text>
      </ScrollView>
    </View>
  )
}
