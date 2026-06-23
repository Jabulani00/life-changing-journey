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
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import UpgradePromptModal from '../components/subscription/UpgradePromptModal'
import { PLAN_ID } from '../config/subscriptionConfig'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createBooking } from '../services/firebase'
import { createStaffTask, saveBooking } from '../services/bookingService'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'
import { staticData } from '../utils/staticData'
import { isWithinOperatingHours } from '../utils/operatingHours'
import { Timestamp } from 'firebase/firestore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// ─── Calendly injected JS (unchanged) ────────────────────────────────────────
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

// ─── Time slot helpers ────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00',
]

function getUpcomingDates(days = 14) {
  const dates = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    dates.push(d)
  }
  return dates
}

function formatDayLabel(date) {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const isTomorrow =
    date.toDateString() === new Date(now.getTime() + 86400000).toDateString()
  if (isToday) return 'Today'
  if (isTomorrow) return 'Tomorrow'
  return date.toLocaleDateString('en-ZA', { weekday: 'short' })
}

function formatDateNum(date) {
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

// ─── In-App Booking Form ──────────────────────────────────────────────────────
function InAppBookingForm({ navigation, user, sub }) {
  const insets = useSafeAreaInsets()
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  const dates = useMemo(() => getUpcomingDates(14), [])
  const services = staticData.services || []

  const uid = user?.uid || user?.id
  const email = user?.email || user?.user_metadata?.email || ''
  const fullName = user?.user_metadata?.full_name || ''

  const canSubmit = selectedService && selectedDate && selectedTime && !busy

  const handleSubmit = async () => {
    if (!canSubmit) return
    if (!uid) {
      Alert.alert('Sign in required', 'Please sign in to book a session.')
      return
    }

    setBusy(true)
    try {
      const [hh, mm] = selectedTime.split(':').map(Number)
      const scheduledDate = new Date(selectedDate)
      scheduledDate.setHours(hh, mm, 0, 0)

      const bookingData = {
        userId: uid,
        userEmail: email,
        userName: fullName || email || 'Member',
        serviceTitle: selectedService.title,
        scheduledAt: Timestamp.fromDate(scheduledDate),
        status: 'pending',
        source: 'manual',
        notes: notes.trim() || null,
        plan: sub.plan || PLAN_ID.SILVER,
        planCategory: sub.profile?.planCategory || 'adults',
        priority: sub.bookingPriority ?? 0,
        discountApplied: sub.discountRate ?? 0,
        sessionType: 'standard',
      }

      const result = await createBooking(bookingData)
      const bookingId = result?.id

      // Schedule local notification (same pattern as Calendly flow)
      if (sub.hasBookingReminders && bookingId) {
        try {
          const { status } = await Notifications.requestPermissionsAsync()
          if (status === 'granted') {
            const remind = new Date(scheduledDate.getTime() - 60 * 60 * 1000)
            if (remind > new Date()) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Upcoming session',
                  body: `Your ${selectedService.title} appointment is coming up soon.`,
                },
                trigger: { type: 'date', date: remind },
              })
            }
          }
        } catch (_) {}
      }

      // Staff tasks (same as Calendly flow)
      if (bookingId) {
        const userName = fullName || email
        if (sub.hasCallReminders) {
          const dueCall = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000)
          await createStaffTask('call_reminder', bookingId, uid, userName, email, sub.plan || PLAN_ID.SILVER, dueCall)
        }
        if (sub.isPlatinum) {
          const dueFollow = new Date(scheduledDate.getTime() + 7 * 24 * 60 * 60 * 1000)
          await createStaffTask('follow_up', bookingId, uid, userName, email, PLAN_ID.PLATINUM, dueFollow)
        }
      }

      navigation.navigate('BookingSuccess', {
        title: 'Booking request sent',
        subtitle: 'We will confirm your appointment shortly. Check My Bookings for updates.',
      })
    } catch (e) {
      console.warn('Booking submit error:', e)
      Alert.alert(
        'Booking failed',
        e?.message || 'Something went wrong. Please try again or contact us directly.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={Colors.gradients?.primary || [Colors.primary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Math.max(insets.top, 44),
          paddingBottom: 20,
          paddingHorizontal: 20,
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
            marginRight: 14,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>
            Book a Session
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
            Choose a service, date &amp; time
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom + 32, 48) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Step 1: Service ───────────────────────────────────────── */}
        <SectionLabel step="1" title="Select a Service" />
        <View style={{ gap: 10, marginBottom: 28 }}>
          {services.map((svc) => {
            const selected = selectedService?.id === svc.id
            return (
              <TouchableOpacity
                key={svc.id}
                onPress={() => setSelectedService(svc)}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: selected ? Colors.primary + '12' : Colors.surface,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? Colors.primary : Colors.lightGray,
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: selected ? Colors.primary + '22' : '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons
                    name={svc.icon || 'briefcase-outline'}
                    size={20}
                    color={selected ? Colors.primary : Colors.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selected ? Colors.primary : Colors.textPrimary,
                    marginBottom: 2,
                  }}>
                    {svc.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 12, color: Colors.textSecondary }}
                  >
                    {svc.shortDescription}
                  </Text>
                </View>
                {selected && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* ── Step 2: Date ──────────────────────────────────────────── */}
        <SectionLabel step="2" title="Choose a Date" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4, gap: 10, paddingRight: 4 }}
          style={{ marginBottom: 28 }}
        >
          {dates.map((date, idx) => {
            const isSelected =
              selectedDate?.toDateString() === date.toDateString()
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => !isPast && setSelectedDate(date)}
                activeOpacity={isPast ? 1 : 0.85}
                style={{
                  width: 64,
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: isSelected ? Colors.primary : Colors.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: Colors.lightGray,
                  opacity: isPast ? 0.38 : 1,
                }}
              >
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: isSelected ? 'rgba(255,255,255,0.85)' : Colors.textSecondary,
                  marginBottom: 6,
                }}>
                  {formatDayLabel(date)}
                </Text>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: isSelected ? '#fff' : Colors.textPrimary,
                }}>
                  {date.getDate()}
                </Text>
                <Text style={{
                  fontSize: 10,
                  color: isSelected ? 'rgba(255,255,255,0.75)' : Colors.textSecondary,
                  marginTop: 3,
                }}>
                  {date.toLocaleDateString('en-ZA', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* ── Step 3: Time ──────────────────────────────────────────── */}
        <SectionLabel step="3" title="Choose a Time" />
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 28,
        }}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot
            return (
              <TouchableOpacity
                key={slot}
                onPress={() => setSelectedTime(slot)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 11,
                  borderRadius: 12,
                  backgroundColor: isSelected ? Colors.primary : Colors.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: Colors.lightGray,
                  minWidth: 84,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isSelected ? '#fff' : Colors.textPrimary,
                }}>
                  {slot}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* ── Step 4: Notes (optional) ──────────────────────────────── */}
        <SectionLabel step="4" title="Additional Notes" optional />
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any specific concerns or questions for your practitioner…"
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: Colors.lightGray,
            padding: 14,
            fontSize: 14,
            color: Colors.textPrimary,
            minHeight: 96,
            textAlignVertical: 'top',
            marginBottom: 28,
          }}
        />

        {/* ── Summary card ─────────────────────────────────────────── */}
        {(selectedService || selectedDate || selectedTime) && (
          <View style={{
            backgroundColor: Colors.primary + '0C',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.primary + '30',
            marginBottom: 20,
            gap: 6,
          }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 4 }}>
              Booking Summary
            </Text>
            {selectedService && (
              <Row icon="briefcase-outline" label={selectedService.title} />
            )}
            {selectedDate && (
              <Row
                icon="calendar-outline"
                label={selectedDate.toLocaleDateString('en-ZA', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              />
            )}
            {selectedTime && (
              <Row icon="time-outline" label={selectedTime} />
            )}
          </View>
        )}

        {/* ── Submit button ─────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.88}
          style={{
            borderRadius: 14,
            overflow: 'hidden',
            opacity: canSubmit ? 1 : 0.45,
          }}
        >
          <LinearGradient
            colors={Colors.gradients?.primary || [Colors.primary, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {busy ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                  Confirm Booking
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={{
          fontSize: 12,
          color: Colors.textSecondary,
          textAlign: 'center',
          marginTop: 14,
          lineHeight: 18,
        }}>
          Our team will confirm your appointment within 24 hours.{'\n'}
          Operating hours: 08:00 – 17:00, Mon–Fri
        </Text>
      </ScrollView>
    </View>
  )
}

// Small helpers
function SectionLabel({ step, title, optional }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <View style={{
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 8,
      }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{step}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textPrimary }}>
        {title}
      </Text>
      {optional && (
        <Text style={{ fontSize: 12, color: Colors.textSecondary, marginLeft: 6 }}>
          (optional)
        </Text>
      )}
    </View>
  )
}

function Row({ icon, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon} size={14} color={Colors.primary} />
      <Text style={{ fontSize: 13, color: Colors.textPrimary, flex: 1 }}>{label}</Text>
    </View>
  )
}

// ─── Main BookingScreen ───────────────────────────────────────────────────────
export default function BookingScreen({ navigation }) {
  const { user } = useAuth()
  const sub = useSubscription()
  const insets = useSafeAreaInsets()
  const [busy, setBusy] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState({
    visible: false,
    suggestedPlan: PLAN_ID.PLATINUM,
    message: '',
  })

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
          const userName = fullName || (typeof raw?.invitee === 'object' && raw.invitee?.name) || email

          if (sub.hasCallReminders) {
            const dueCall = new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
            await createStaffTask('call_reminder', bookingId, uid, userName, email, sub.plan || PLAN_ID.SILVER, dueCall)
          }
          if (sub.isPlatinum) {
            const dueFollow = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
            await createStaffTask('follow_up', bookingId, uid, userName, email, PLAN_ID.PLATINUM, dueFollow)
          }
        }

        navigation.navigate('BookingSuccess', {
          title: 'Booking confirmed',
          subtitle: 'Your Calendly session is saved in the app.',
        })
      } catch (e) {
        console.warn('Calendly save', e)
        Alert.alert(
          'Could not save booking',
          e?.message || 'Please try again or check My Bookings later.',
        )
      } finally {
        setBusy(false)
      }
    },
    [busy, uid, isGuest, user, sub, fullName, email, navigation],
  )

  // ── Guest wall ──────────────────────────────────────────────────────────────
  if (isGuest) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={Colors.gradients?.primary || [Colors.primary, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: Math.max(insets.top, 44),
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack?.()}
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center', alignItems: 'center', marginRight: 14,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Book a Session</Text>
        </LinearGradient>

        <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: Colors.primary + '18',
            justifyContent: 'center', alignItems: 'center',
            alignSelf: 'center', marginBottom: 20,
          }}>
            <Ionicons name="lock-closed-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 10 }}>
            Sign in to book
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
            Bookings are linked to your membership. Please sign in to schedule a session.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}
            activeOpacity={0.88}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{ paddingVertical: 14, alignItems: 'center', marginTop: 6 }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.primary }}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // ── Outside operating hours ─────────────────────────────────────────────────
  if (!allowedByHours) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={Colors.gradients?.primary || [Colors.primary, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: Math.max(insets.top, 44),
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack?.()}
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center', alignItems: 'center', marginRight: 14,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Book a Session</Text>
        </LinearGradient>

        <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: Colors.primary + '18',
            justifyContent: 'center', alignItems: 'center',
            alignSelf: 'center', marginBottom: 20,
          }}>
            <Ionicons name="time-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 10 }}>
            We're currently closed
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
            Bookings are available between 08:00 and 17:00.{'\n'}
            Upgrade to Platinum for 24-hour booking access.
          </Text>
          <TouchableOpacity
            onPress={() =>
              setUpgradeModal({
                visible: true,
                suggestedPlan: PLAN_ID.PLATINUM,
                message: 'Platinum includes 24-hour booking access and priority scheduling.',
              })
            }
            style={{ backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}
            activeOpacity={0.88}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>View Platinum Plan</Text>
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

  // ── No Calendly URL → show in-app form ─────────────────────────────────────
  if (!calendlyUri) {
    return <InAppBookingForm navigation={navigation} user={user} sub={sub} />
  }

  // ── Calendly WebView (existing flow, unchanged) ─────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients?.primary || [Colors.primary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Math.max(insets.top, 44),
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack?.()}
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center', alignItems: 'center', marginRight: 14,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>
            Schedule with Calendly
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
            {email ? `Prefilled: ${email}` : ' '}
          </Text>
        </View>
      </LinearGradient>

      {busy ? (
        <View style={{ padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
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
