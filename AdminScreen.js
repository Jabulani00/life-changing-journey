// Admin Screen - Post events, motivations, view all bookings (admin only)
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
import {
    addEvent,
    addMotivation,
    getBookings,
    getEvents,
    getLiveStreamConfig,
    getMotivations,
    setLiveStreamConfig,
    updateBooking,
} from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const AdminScreen = ({ navigation }) => {
  const [tab, setTab] = useState('events') // 'events' | 'motivations' | 'bookings' | 'live'
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [motivations, setMotivations] = useState([])
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
      Alert.alert('Error', e.message || 'Failed to post event.')
    } finally {
      setPosting(false)
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
      Alert.alert('Posted!', 'Motivation has been shared with users.')
      load()
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to post motivation.')
    } finally {
      setMotPosting(false)
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

  const TABS = [
    { key: 'events', label: 'Events' },
    { key: 'motivations', label: 'Motiv.' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'live', label: 'Live' },
  ]

  const MOT_CATEGORIES = ['general', 'scripture', 'encouragement', 'mindset']

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
        <Text style={styles.title}>Admin</Text>
        <Text style={styles.subtitle}>Manage events, motivations & bookings</Text>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {/* ── EVENTS TAB ── */}
            {tab === 'events' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Post new event</Text>
                  <TextInput style={styles.input} placeholder="Event title *" placeholderTextColor={Colors.textMuted} value={title} onChangeText={setTitle} />
                  <TextInput style={[styles.input, styles.inputMulti]} placeholder="Description (optional)" placeholderTextColor={Colors.textMuted} value={description} onChangeText={setDescription} multiline numberOfLines={3} />
                  <TextInput style={styles.input} placeholder="Date & time (e.g. 2025-12-01T10:00)" placeholderTextColor={Colors.textMuted} value={eventDate} onChangeText={setEventDate} />
                  <TextInput style={styles.input} placeholder="Location or online link (optional)" placeholderTextColor={Colors.textMuted} value={location} onChangeText={setLocation} />
                  <TouchableOpacity
                    style={[styles.btn, posting && styles.btnDisabled]}
                    onPress={handlePostEvent}
                    disabled={posting}
                  >
                    {posting ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.btnText}>Post event</Text>}
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

            {/* ── MOTIVATIONS TAB ── */}
            {tab === 'motivations' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Post daily motivation</Text>
                  <TextInput
                    style={[styles.input, styles.inputMulti]}
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
                  {/* Category Picker */}
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryRow}>
                    {MOT_CATEGORIES.map((cat) => (
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
                    {motPosting ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.btnText}>Post motivation</Text>}
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

            {/* ── LIVE TAB ── */}
            {tab === 'live' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live stream links</Text>
                <Text style={styles.muted}>These URLs are shown on the Live screen.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YouTube Live URL"
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
                  {liveSaving ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.btnText}>Save live links</Text>}
                </TouchableOpacity>
              </View>
            )}

            {/* ── BOOKINGS TAB ── */}
            {tab === 'bookings' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All bookings ({bookings.length})</Text>
                {bookings.length === 0 ? (
                  <Text style={styles.muted}>No bookings yet.</Text>
                ) : (
                  bookings.map((b) => (
                    <View key={b.id} style={styles.bookingCard}>
                      <Text style={styles.bookingName}>{b.name} {b.surname}</Text>
                      <Text style={styles.bookingMeta}>{b.serviceTitle} — {b.date} at {b.time}</Text>
                      <Text style={styles.bookingMeta}>📧 {b.email} | 📞 {b.phone}</Text>
                      {b.notes ? <Text style={styles.bookingNotes}>Notes: {b.notes}</Text> : null}
                      <View style={styles.bookingActions}>
                        <View style={[styles.statusBadge, { backgroundColor: b.status === 'approved' ? '#10B98120' : b.status === 'cancelled' ? '#EF444420' : '#F59E0B20' }]}>
                          <Text style={{ fontSize: 12, color: b.status === 'approved' ? '#10B981' : b.status === 'cancelled' ? '#EF4444' : '#F59E0B', fontWeight: '600' }}>
                            {(b.status || 'pending').toUpperCase()}
                          </Text>
                        </View>
                        {b.status !== 'approved' && (
                          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={() => handleBookingAction(b.id, 'approved')}>
                            <Text style={styles.actionBtnText}>Approve</Text>
                          </TouchableOpacity>
                        )}
                        {b.status !== 'cancelled' && (
                          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleBookingAction(b.id, 'cancelled')}>
                            <Text style={styles.actionBtnText}>Cancel</Text>
                          </TouchableOpacity>
                        )}
                      </View>
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 50, paddingBottom: 8, paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', marginBottom: 4 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2, marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 4, marginTop: 4, marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  muted: { fontSize: 13, color: '#9CA3AF', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 10 },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  catTextActive: { color: '#FFFFFF', fontWeight: '600' },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  listItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  listItemTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  listItemMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  bookingCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  bookingName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  bookingMeta: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  bookingNotes: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginTop: 2 },
  bookingActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
})

export default AdminScreen
