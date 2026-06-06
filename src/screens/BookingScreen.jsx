import { Ionicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import UpgradePromptModal from '../components/subscription/UpgradePromptModal'
import { PLAN_ID } from '../config/subscriptionConfig'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createStaffTask, saveBooking } from '../services/bookingService'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'
import { isWithinOperatingHours } from '../utils/operatingHours'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const INJECTED = `
(function() {
  function forward(e) {
    try {
      if (!e || !e.data) return;
      var ev = e.data.event || e.data;
      if (typeof ev === 'string' && ev.indexOf('calendly') === 0) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'calendly', payload: e.data }));
        }
      }
    } catch (err) {}
  }
  window.addEventListener('message', forward);
  document.addEventListener('message', forward);
  true;
})();
`

function buildCalendlyUrl(base, name, email, utmSource) {
  try {
    const u = new URL(base)
    if (name) u.searchParams.set('name', name)
    if (email) u.searchParams.set('email', email)
    if (utmSource) u.searchParams.set('utm_source', utmSource)
    u.searchParams.set('hide_gdpr_banner', '1')
    return u.toString()
  } catch {
    return base
  }
}

export default function BookingScreen({ navigation }) {
  const { user } = useAuth()
  const sub = useSubscription()
  const [busy, setBusy] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState({ visible: false, suggestedPlan: PLAN_ID.PLATINUM, message: '' })

  const uid = user?.uid || user?.id
  const isGuest = !user || user?.isAnonymous
  const fullName = (user?.user_metadata?.full_name || '').trim()
  const email = (user?.email || user?.user_metadata?.email || '').trim()

  const embedBase = process.env.EXPO_PUBLIC_CALENDLY_EMBED_URL || ''
  const calendlyUri = useMemo(() => {
    if (!embedBase) return ''
    return buildCalendlyUrl(embedBase, fullName, email, sub.plan || PLAN_ID.SILVER)
  }, [embedBase, fullName, email, sub.plan])

  const allowedByHours = sub.has24hrAccess || isWithinOperatingHours()

  const onCalendlyMessage = useCallback(
    async (event) => {
      if (busy) return
      let parsed
      try {
        parsed = JSON.parse(event.nativeEvent.data)
      } catch {
        return
      }
      if (parsed?.type !== 'calendly' || !parsed?.payload) return
      const outer = parsed.payload
      const eventName = outer?.event
      if (String(eventName) !== 'calendly.event_scheduled') return

      if (!uid || isGuest) {
        Alert.alert('Sign in required', 'Please sign in to save your booking to your account.')
        return
      }

      setBusy(true)
      try {
        const subscriptionData = {
          plan: sub.plan || PLAN_ID.SILVER,
          planCategory: sub.profile?.planCategory || 'adults',
          priority: sub.bookingPriority ?? 0,
          discountRate: sub.discountRate ?? 0,
        }

        const result = await saveBooking(uid, user, outer, subscriptionData)
        const bookingId = result?.id

        if (sub.hasBookingReminders && bookingId) {
          try {
            const { status } = await Notifications.requestPermissionsAsync()
            if (status === 'granted') {
              const raw = outer?.payload || outer
              const ev = raw?.event
              const start =
                (typeof ev === 'object' && ev?.start_time) || raw?.start_time || null
              if (start) {
                const startDate = new Date(start)
                const remind = new Date(startDate.getTime() - 60 * 60 * 1000)
                if (remind > new Date()) {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: 'Upcoming session',
                      body: 'Your Life Changing Journey appointment is coming up soon.',
                    },
                    trigger: { type: 'date', date: remind },
                  })
                }
              }
            }
          } catch (e) {
            console.warn('Notification schedule', e)
          }
        }

        if (bookingId) {
          const raw = outer?.payload || outer
          const ev = raw?.event
          const start =
            (typeof ev === 'object' && ev?.start_time) || raw?.start_time || null
          const startDate = start ? new Date(start) : new Date()
          const userName =
            fullName ||
            (typeof raw?.invitee === 'object' && raw.invitee?.name) ||
            email

          if (sub.hasCallReminders) {
            const dueCall = new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
            await createStaffTask(
              'call_reminder',
              bookingId,
              uid,
              userName,
              email,
              sub.plan || PLAN_ID.SILVER,
              dueCall
            )
          }
          if (sub.isPlatinum) {
            const dueFollow = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
            await createStaffTask(
              'follow_up',
              bookingId,
              uid,
              userName,
              email,
              PLAN_ID.PLATINUM,
              dueFollow
            )
          }

        }

        navigation.navigate('BookingSuccess', {
          title: 'Booking confirmed',
          subtitle: 'Your Calendly session is saved in the app.',
        })
      } catch (e) {
        console.warn('Calendly save', e)
        Alert.alert('Could not save booking', e?.message || 'Please try again or check My Bookings later.')
      } finally {
        setBusy(false)
      }
    },
    [busy, uid, isGuest, user, sub, fullName, email, navigation]
  )

  if (isGuest) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 }}>
        <StatusBar style="dark" />
        <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, marginBottom: 12 }}>
          Sign in to book
        </Text>
        <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 20 }}>
          Calendly bookings are linked to your membership. Please sign in to continue.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!allowedByHours) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 50, paddingBottom: 24, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack?.()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ ...Typography.textStyles.h4, color: Colors.white }}>Book appointment</Text>
          </View>
        </LinearGradient>
        <View style={{ padding: 20 }}>
          <Text style={{ ...Typography.textStyles.body, color: Colors.textPrimary, marginBottom: 16 }}>
            Bookings are available between 8am and 6pm. Upgrade to Platinum for 24-hour access.
          </Text>
          <TouchableOpacity
            onPress={() =>
              setUpgradeModal({
                visible: true,
                suggestedPlan: PLAN_ID.PLATINUM,
                message: 'Platinum includes 24-hour booking access and priority scheduling.',
              })
            }
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>View Platinum</Text>
          </TouchableOpacity>
        </View>
        <UpgradePromptModal
          visible={upgradeModal.visible}
          onClose={() => setUpgradeModal((m) => ({ ...m, visible: false }))}
          suggestedPlan={upgradeModal.suggestedPlan}
          message={upgradeModal.message}
          navigation={navigation}
        />
      </View>
    )
  }

  if (!calendlyUri) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20, justifyContent: 'center' }}>
        <StatusBar style="dark" />
        <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, marginBottom: 8 }}>
          Calendly URL not configured
        </Text>
        <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 16 }}>
          Add EXPO_PUBLIC_CALENDLY_EMBED_URL to your .env (your Calendly scheduling link), then restart Expo.
        </Text>
        {Platform.OS === 'web' ? (
          <Text style={{ ...Typography.textStyles.caption, color: Colors.textMuted }}>Web: set env in app config.</Text>
        ) : null}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack?.()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.textStyles.h4, color: Colors.white }}>Schedule with Calendly</Text>
          <Text style={{ ...Typography.textStyles.caption, color: Colors.white, opacity: 0.9 }}>
            {email ? `Prefilled: ${email}` : ' '}
          </Text>
        </View>
      </LinearGradient>

      {busy ? (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 8 }}>
            Saving your booking…
          </Text>
        </View>
      ) : null}

      <WebView
        source={{ uri: calendlyUri }}
        style={{ flex: 1 }}
        onMessage={onCalendlyMessage}
        injectedJavaScript={INJECTED}
        onShouldStartLoadWithRequest={(req) => {
          if (Platform.OS === 'ios' && req.url.startsWith('tel:')) {
            Linking.openURL(req.url)
            return false
          }
          return true
        }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />

      <UpgradePromptModal
        visible={upgradeModal.visible}
        onClose={() => setUpgradeModal((m) => ({ ...m, visible: false }))}
        suggestedPlan={upgradeModal.suggestedPlan}
        message={upgradeModal.message}
        navigation={navigation}
      />
    </View>
  )
}
