// Admin Screen - Post events, view all bookings (admin only)
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { addEvent, addMotivation, getBookings, getEvents, getLiveStreamConfig, getMotivations, setLiveStreamConfig, updateBooking } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const AdminScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.initialTab || 'events'
  const [tab, setTab] = useState(initialTab) // 'events' | 'bookings' | 'live' | 'motivations'
  const [events, setEvents] = useState([])
  const [motivations, setMotivations] = useState([])

  useEffect(() => {
    if (route?.params?.initialTab) setTab(route.params.initialTab)
  }, [route?.params?.initialTab])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [posting, setPosting] = useState(false)
  // Post event form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  // Post motivation form
  const [motMessage, setMotMessage] = useState('')
  const [motCategory, setMotCategory] = useState('general')
  const [motAuthor, setMotAuthor] = useState('')
  const [motPosting, setMotPosting] = useState(false)
  // Live stream config
  const [liveYoutubeUrl, setLiveYoutubeUrl] = useState('')
  const [liveFacebookUrl, setLiveFacebookUrl] = useState('')
  const [liveSaving, setLiveSaving] = useState(false)

  const load = async () => {
    try {
      const [evList, bookList, motList] = await Promise.all([
        getEvents(),
        getBookings(null, true),
        getMotivations(),
      ])
      setEvents(evList)
      setBookings(bookList)
      setMotivations(motList)
    } catch (e) {
      console.warn('Admin load error:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (tab === 'live') {
      getLiveStreamConfig().then((c) => {
        setLiveYoutubeUrl(c.youtubeUrl || '')
        setLiveFacebookUrl(c.facebookUrl || '')
      }).catch(() => {})
    }
  }, [tab])

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  const handleBookingAction = async (bookingId, status) => {
    try {
      await updateBooking(bookingId, { status })
      load()
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to update booking.')
    }
  }

  const handleSaveLiveStream = async () => {
    setLiveSaving(true)
    try {
      await setLiveStreamConfig({
        youtubeUrl: liveYoutubeUrl.trim() || null,
        facebookUrl: liveFacebookUrl.trim() || null,
      })
      Alert.alert('Saved', 'Live stream links updated.')
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to save.')
    } finally {
      setLiveSaving(false)
    }
  }

  const handlePostMotivation = async () => {
    const msg = motMessage.trim()
    if (!msg) {
      Alert.alert('Missing message', 'Please enter a motivational message or quote.')
      return
    }
    setMotPosting(true)
    try {
      await addMotivation({
        message: msg,
        category: motCategory,
        author: motAuthor.trim() || null,
      })
      setMotMessage('')
      setMotAuthor('')
      setMotCategory('general')
      Alert.alert('Done', 'Motivation posted.')
      load()
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to post motivation.')
    } finally {
      setMotPosting(false)
    }
  }

  const handlePostEvent = async () => {
    const t = title.trim()
    if (!t) {
      Alert.alert('Missing title', 'Please enter an event title.')
      return
    }
    setPosting(true)
    try {
      await addEvent({
        title: t,
        description: description.trim() || null,
        date: eventDate.trim() || new Date().toISOString(),
        location: location.trim() || null,
      })
      setTitle('')
      setDescription('')
      setEventDate('')
      setLocation('')
      Alert.alert('Done', 'Event posted.')
      load()
    } catch (e) {
      const msg = e?.message || 'Failed to post event.'
      const isPermissionError =
        msg.includes('permission') ||
        msg.includes('PERMISSION_DENIED') ||
        e?.code === 'permission-denied'
      Alert.alert(
        'Error',
        isPermissionError
          ? `${msg}\n\nFix: In Firebase Console → Firestore → Rules, use test mode or allow write on "events" (see FIREBASE_SETUP.md).`
          : msg
      )
    } finally {
      setPosting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          accessibilityLabel="Back to dashboard"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin</Text>
        <Text style={styles.subtitle}>Post events, motivations & view bookings</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'events' && styles.tabActive]}
            onPress={() => setTab('events')}
          >
            <Text style={[styles.tabText, tab === 'events' && styles.tabTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'bookings' && styles.tabActive]}
            onPress={() => setTab('bookings')}
          >
            <Text style={[styles.tabText, tab === 'bookings' && styles.tabTextActive]}>
              Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'motivations' && styles.tabActive]}
            onPress={() => setTab('motivations')}
          >
            <Text style={[styles.tabText, tab === 'motivations' && styles.tabTextActive]}>
              Motiv.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'live' && styles.tabActive]}
            onPress={() => setTab('live')}
          >
            <Text style={[styles.tabText, tab === 'live' && styles.tabTextActive]}>
              Live
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {tab === 'events' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Post new event</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Event title *"
                    placeholderTextColor={Colors.textMuted}
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    placeholderTextColor={Colors.textMuted}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Date (e.g. 2025-03-15)"
                    placeholderTextColor={Colors.textMuted}
                    value={eventDate}
                    onChangeText={setEventDate}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Location"
                    placeholderTextColor={Colors.textMuted}
                    value={location}
                    onChangeText={setLocation}
                  />
                  <TouchableOpacity
                    style={[styles.btn, posting && styles.btnDisabled]}
                    onPress={handlePostEvent}
                    disabled={posting}
                  >
                    {posting ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.btnText}>Post event</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recent events</Text>
                  {events.length === 0 ? (
                    <Text style={styles.muted}>No events yet.</Text>
                  ) : (
                    events.slice(0, 10).map((ev) => (
                      <View key={ev.id} style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{ev.title}</Text>
                        <Text style={styles.listItemMeta}>{formatDate(ev.date)}</Text>
                      </View>
                    ))
                  )}
                </View>
              </>
            )}

            {tab === 'motivations' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Post daily motivation</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, styles.inputMulti]}
                    placeholder="Quote, message or scripture *"
                    placeholderTextColor={Colors.textMuted}
                    value={motMessage}
                    onChangeText={setMotMessage}
                    multiline
                    numberOfLines={4}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Author / source (optional)"
                    placeholderTextColor={Colors.textMuted}
                    value={motAuthor}
                    onChangeText={setMotAuthor}
                  />
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryRow}>
                    {['general', 'scripture', 'encouragement', 'mindset'].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, motCategory === cat && styles.catChipActive]}
                        onPress={() => setMotCategory(cat)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.catText, motCategory === cat && styles.catTextActive]}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.btn, motPosting && styles.btnDisabled]}
                    onPress={handlePostMotivation}
                    disabled={motPosting}
                  >
                    {motPosting ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.btnText}>Post motivation</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recent motivations ({motivations.length})</Text>
                  {motivations.length === 0 ? (
                    <Text style={styles.muted}>No posts yet.</Text>
                  ) : (
                    motivations.slice(0, 10).map((m) => (
                      <View key={m.id} style={styles.listItem}>
                        <Text style={styles.listItemTitle} numberOfLines={2}>{m.message}</Text>
                        <Text style={styles.listItemMeta}>{m.category} • {formatDate(m.createdAt)}</Text>
                      </View>
                    ))
                  )}
                </View>
              </>
            )}

            {tab === 'live' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live stream links</Text>
                <Text style={styles.muted}>These URLs are shown on the Live screen. Users can open them to watch YouTube or Facebook Live.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YouTube Live URL (e.g. https://youtube.com/watch?v=... or live link)"
                  placeholderTextColor={Colors.textMuted}
                  value={liveYoutubeUrl}
                  onChangeText={setLiveYoutubeUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Facebook Live URL"
                  placeholderTextColor={Colors.textMuted}
                  value={liveFacebookUrl}
                  onChangeText={setLiveFacebookUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <TouchableOpacity
                  style={[styles.btn, liveSaving && styles.btnDisabled]}
                  onPress={handleSaveLiveStream}
                  disabled={liveSaving}
                >
                  {liveSaving ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.btnText}>Save live links</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {tab === 'bookings' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All bookings</Text>
                {bookings.length === 0 ? (
                  <Text style={styles.muted}>No bookings yet.</Text>
                ) : (
                  bookings.map((b) => (
                    <View key={b.id} style={styles.bookingCard}>
                      <Text style={styles.bookingService}>{b.serviceTitle || 'Booking'}</Text>
                      <Text style={styles.bookingMeta}>
                        {b.userEmail || b.userId} • {b.date} at {b.time}
                      </Text>
                      {b.notes ? (
                        <Text style={styles.bookingNotes} numberOfLines={2}>{b.notes}</Text>
                      ) : null}
                      <Text style={styles.bookingStatus}>Status: {b.status || 'pending'}</Text>
                      {(b.status === 'pending' || b.status === 'rescheduled') && (
                        <View style={styles.bookingActions}>
                          <TouchableOpacity
                            style={[styles.bookingActionBtn, styles.bookingActionApprove]}
                            onPress={() => handleBookingAction(b.id, 'approved')}
                          >
                            <Text style={styles.bookingActionText}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.bookingActionBtn, styles.bookingActionReschedule]}
                            onPress={() => handleBookingAction(b.id, 'rescheduled')}
                          >
                            <Text style={styles.bookingActionText}>Reschedule</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.bookingActionBtn, styles.bookingActionCancel]}
                            onPress={() => handleBookingAction(b.id, 'cancelled')}
                          >
                            <Text style={styles.bookingActionText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
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
  tabs: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabActive: { backgroundColor: Colors.white },
  tabText: { ...Typography.textStyles.bodySmall, color: Colors.white },
  tabTextActive: { ...Typography.textStyles.bodySmall, color: Colors.primary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: {
    ...Typography.textStyles.h6,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    ...Typography.textStyles.body,
    color: Colors.textPrimary,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputMulti: { minHeight: 100 },
  label: {
    ...Typography.textStyles.captionBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  catChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  catChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  catText: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
  },
  catTextActive: {
    ...Typography.textStyles.captionBold,
    color: Colors.primary,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { ...Typography.textStyles.bodyBold, color: Colors.white },
  muted: { ...Typography.textStyles.caption, color: Colors.textSecondary },
  listItem: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  listItemTitle: { ...Typography.textStyles.bodyBold, color: Colors.textPrimary },
  listItemMeta: { ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 4 },
  bookingCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  bookingService: { ...Typography.textStyles.bodyBold, color: Colors.textPrimary },
  bookingMeta: { ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 4 },
  bookingNotes: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  bookingStatus: { ...Typography.textStyles.caption, color: Colors.primary, marginTop: 2 },
  bookingActions: { flexDirection: 'row', marginTop: 10, gap: 8, flexWrap: 'wrap' },
  bookingActionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  bookingActionApprove: { backgroundColor: Colors.success + '30' },
  bookingActionReschedule: { backgroundColor: Colors.primary + '30' },
  bookingActionCancel: { backgroundColor: Colors.error + '30' },
  bookingActionText: { ...Typography.textStyles.captionBold, color: Colors.textPrimary },
})

export default AdminScreen
