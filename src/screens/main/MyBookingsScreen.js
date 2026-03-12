// My Bookings - List user's bookings from Firebase
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import ExpandableText from '../../components/common/ExpandableText'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { getBookings } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const MyBookingsScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const userId = user?.id ?? user?.user?.id

  const load = async () => {
    if (!userId) {
      setBookings([])
      setLoading(false)
      setRefreshing(false)
      return
    }
    try {
      const list = await getBookings(userId, false)
      setBookings(list)
    } catch (e) {
      console.warn('Bookings load error:', e)
      setBookings([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [userId])

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Your scheduled appointments</Text>
      </LinearGradient>

      {!userId ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>Sign in to see your bookings.</Text>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {bookings.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color={Colors.gray} />
              <Text style={styles.emptyText}>No bookings yet</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('Tabs', { screen: 'Booking' })}
              >
                <Text style={styles.btnText}>Book a session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookings.map((b) => (
              <View key={b.id} style={styles.card}>
                <Text style={styles.service}>{b.serviceTitle || 'Booking'}</Text>
                <Text style={styles.meta}>
                  {b.date} at {b.time}
                </Text>
                {b.notes ? (
                  <ExpandableText
                    text={b.notes}
                    truncateLength={100}
                    style={styles.notes}
                  />
                ) : null}
                <View style={styles.statusRow}>
                  <Text style={styles.status}>Status: {b.status || 'pending'}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.textStyles.h3,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.textStyles.bodySmall,
    color: Colors.white,
    opacity: 0.9,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { ...Typography.textStyles.body, color: Colors.textSecondary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    ...Typography.textStyles.h6,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  btn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnText: { ...Typography.textStyles.bodyBold, color: Colors.white },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  service: { ...Typography.textStyles.h6, color: Colors.textPrimary },
  meta: { ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 4 },
  notes: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  statusRow: { marginTop: 8 },
  status: { ...Typography.textStyles.caption, color: Colors.primary },
})

export default MyBookingsScreen
