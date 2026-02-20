// Events Screen - List events from Firebase (admin posts from Admin screen)
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
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getEvents } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      const list = await getEvents()
      setEvents(list)
    } catch (e) {
      console.warn('Events load error:', e)
      setEvents([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Workshops, sessions & community events</Text>
      </LinearGradient>

      {loading ? (
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
          {events.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color={Colors.gray} />
              <Text style={styles.emptyText}>No events yet</Text>
              <Text style={styles.emptySubtext}>
                Check back later for workshops and sessions.
              </Text>
            </View>
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {event.title || 'Event'}
                  </Text>
                  <Text style={styles.cardDate}>
                    {formatDate(event.date)}
                  </Text>
                </View>
                {event.description ? (
                  <Text style={styles.cardDesc} numberOfLines={4}>
                    {event.description}
                  </Text>
                ) : null}
                {event.location ? (
                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.location}>{event.location}</Text>
                  </View>
                ) : null}
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
  emptySubtext: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardHeader: { marginBottom: 8 },
  cardTitle: {
    ...Typography.textStyles.h6,
    color: Colors.textPrimary,
  },
  cardDate: {
    ...Typography.textStyles.caption,
    color: Colors.primary,
    marginTop: 4,
  },
  cardDesc: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
  },
})

export default EventsScreen
