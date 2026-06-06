import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { PLAN_ID } from '../config/subscriptionConfig'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { adminGetAllBookings } from '../services/adminService'
import { cancelEvent, extractUuid } from '../services/calendlyService'
import { cancelBooking } from '../services/bookingService'
import { getStaffTasks, updateStaffTaskCompleted } from '../services/firebase'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'

const PLAN_BADGE = {
  silver: { label: 'SILVER', bg: '#E2E8F0', fg: '#475569' },
  gold: { label: 'GOLD', bg: '#FDE68A', fg: '#92400E' },
  platinum: { label: 'PLATINUM', bg: '#5B21B6', fg: '#F5F3FF' },
}

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminBookingsScreen({ navigation }) {
  const { admin } = useAuth()
  const { profile } = useSubscription()
  const canAccess = admin || profile?.isAdmin === true

  const [filter, setFilter] = useState('all')
  const [bookings, setBookings] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const [b, t] = await Promise.all([adminGetAllBookings(), getStaffTasks()])
      setBookings(Array.isArray(b) ? b : [])
      setTasks(Array.isArray(t) ? t : [])
    } catch (e) {
      console.warn('AdminBookings load', e)
      Alert.alert('Load failed', e?.message || 'Could not load data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (canAccess) load()
    else setLoading(false)
  }, [canAccess, load])

  const filtered = useMemo(() => {
    let list = bookings
    if (filter === PLAN_ID.SILVER) list = list.filter((x) => (x.plan || 'silver') === 'silver')
    if (filter === PLAN_ID.GOLD) list = list.filter((x) => x.plan === 'gold')
    if (filter === PLAN_ID.PLATINUM) list = list.filter((x) => x.plan === 'platinum')
    return list
  }, [bookings, filter])

  const onCancel = async (b) => {
    const id = b.id
    const eventUri = b.eventUri
    Alert.alert('Cancel booking', 'Cancel in Calendly and mark as cancelled in the app?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            if (eventUri) {
              const uuid = extractUuid(eventUri)
              if (uuid) await cancelEvent(uuid, 'Cancelled in admin app')
            }
            await cancelBooking(id)
            await load()
          } catch (e) {
            Alert.alert('Cancel failed', e?.message || 'Try again.')
          }
        },
      },
    ])
  }

  const toggleTask = async (taskId, completed) => {
    try {
      await updateStaffTaskCompleted(taskId, completed)
      await load()
    } catch (e) {
      Alert.alert('Update failed', e?.message || 'Try again.')
    }
  }

  if (!canAccess) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 }}>
        <StatusBar style="dark" />
        <Text style={{ ...Typography.textStyles.body, color: Colors.textSecondary, textAlign: 'center' }}>
          Admin access only. Ask an owner to set isAdmin on your user profile or use an admin email.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack?.()} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.primary }}>Go back</Text>
        </TouchableOpacity>
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
        style={{ paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack?.()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.white, marginLeft: 8 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ ...Typography.textStyles.h4, color: Colors.white, marginTop: 10 }}>Bookings & tasks</Text>
        <Text style={{ ...Typography.textStyles.caption, color: Colors.white, opacity: 0.9 }}>
          Calendly-linked rows + staff follow-ups
        </Text>
      </LinearGradient>

      <View style={{ flexDirection: 'row', padding: 12, gap: 8, flexWrap: 'wrap' }}>
        {['all', PLAN_ID.SILVER, PLAN_ID.GOLD, PLAN_ID.PLATINUM].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: filter === f ? Colors.primary : Colors.surface,
              borderWidth: 1,
              borderColor: filter === f ? Colors.primary : Colors.lightGray,
            }}
          >
            <Text
              style={{
                ...Typography.textStyles.captionBold,
                color: filter === f ? Colors.white : Colors.textPrimary,
                textTransform: 'capitalize',
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginBottom: 8 }}>
            Bookings ({filtered.length})
          </Text>
          {filtered.map((b) => {
            const planKey = (b.plan || 'silver').toLowerCase()
            const badge = PLAN_BADGE[planKey] || PLAN_BADGE.silver
            const when = b.scheduledAt || b.createdAt
            return (
              <View
                key={b.id}
                style={{
                  backgroundColor: Colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: Colors.lightGray,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary }}>
                      {b.userName || b.name || 'Member'}
                    </Text>
                    <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>{b.userEmail || b.email}</Text>
                  </View>
                  <View style={{ backgroundColor: badge.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ ...Typography.textStyles.captionBold, color: badge.fg, fontSize: 10 }}>{badge.label}</Text>
                  </View>
                </View>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 6 }}>
                  Priority {typeof b.priority === 'number' ? b.priority : 0} · {formatWhen(when)}
                </Text>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textMuted, marginTop: 4 }}>
                  Status: {b.status || '—'}
                </Text>
                <TouchableOpacity
                  onPress={() => onCancel(b)}
                  style={{
                    marginTop: 10,
                    alignSelf: 'flex-start',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: Colors.error + '22',
                  }}
                >
                  <Text style={{ ...Typography.textStyles.captionBold, color: Colors.error }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )
          })}

          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 16, marginBottom: 8 }}>
            Staff tasks ({tasks.length})
          </Text>
          {tasks.map((t) => (
            <View
              key={t.id}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: Colors.lightGray,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textPrimary }}>{t.type}</Text>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                  {t.userName || '—'} · {t.userEmail || '—'}
                </Text>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textMuted }}>Due: {formatWhen(t.dueAt)}</Text>
              </View>
              <Switch value={!!t.completed} onValueChange={(v) => toggleTask(t.id, v)} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
