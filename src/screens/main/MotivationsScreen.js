// Daily Motivations Screen - Feed of admin-posted quotes, messages & scriptures
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ExpandableText from '../../components/common/ExpandableText'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getMotivations } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const FALLBACK_MOTIVATIONS = [
  {
    id: 'f1',
    message: 'You are stronger than you think. Every challenge you face is shaping you into the person you are meant to become.',
    category: 'encouragement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'f2',
    message: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
    category: 'scripture',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'f3',
    message: 'Your mind is a garden. What you plant today determines what blooms tomorrow. Choose thoughts of growth, gratitude, and grace.',
    category: 'mindset',
    createdAt: new Date().toISOString(),
  },
]

const CATEGORY_COLORS = {
  scripture: '#8B5CF6',
  encouragement: '#10B981',
  mindset: '#F59E0B',
  general: Colors.primary,
}

const CATEGORY_ICONS = {
  scripture: 'book',
  encouragement: 'heart',
  mindset: 'bulb',
  general: 'sparkles',
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const FAV_KEY = 'lcj_fav_motivations'

const MotivationCard = ({ item, isFav, onToggleFav }) => {
  const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.general
  const icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.general

  const handleShare = async () => {
    try {
      await Share.share({ message: item.message + (item.author ? `\n— ${item.author}` : '') })
    } catch {}
  }

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon + '-outline'} size={14} color={color} />
          <Text style={[styles.categoryText, { color }]}>
            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Daily'}
          </Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>

      <ExpandableText
        text={item.message}
        truncateLength={200}
        style={styles.messageText}
      />

      {item.author && (
        <Text style={styles.authorText}>— {item.author}</Text>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 12 }}>
        <TouchableOpacity onPress={handleShare} activeOpacity={0.8} style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onToggleFav(item.id)} activeOpacity={0.8} style={styles.actionBtn}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#EF4444' : Colors.primary} />
          <Text style={[styles.actionBtnText, isFav && { color: '#EF4444' }]}>{isFav ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const MotivationsScreen = ({ navigation }) => {
  const [motivations, setMotivations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [favIds, setFavIds] = useState(new Set())

  const loadFavs = async () => {
    try {
      const raw = await AsyncStorage.getItem(FAV_KEY)
      if (raw) setFavIds(new Set(JSON.parse(raw)))
    } catch {}
  }

  const toggleFav = async (id) => {
    setFavIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      AsyncStorage.setItem(FAV_KEY, JSON.stringify([...next])).catch(() => {})
      return next
    })
  }

  const load = async () => {
    try {
      const list = await getMotivations()
      setMotivations(list.length > 0 ? list : FALLBACK_MOTIVATIONS)
    } catch (e) {
      console.warn('Motivations load error:', e)
      setMotivations(FALLBACK_MOTIVATIONS)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
    loadFavs()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  const filters = ['all', 'scripture', 'encouragement', 'mindset', 'saved']

  const filtered = activeFilter === 'saved'
    ? motivations.filter((m) => favIds.has(m.id))
    : activeFilter === 'all'
      ? motivations
      : motivations.filter((m) => m.category === activeFilter)

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Daily Motivations</Text>
          <Text style={styles.subtitle}>Inspiration, scriptures & encouragement</Text>
        </View>
      </LinearGradient>

      {/* Category Filters */}
      <View style={styles.filtersWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="sparkles-outline" size={48} color={Colors.gray || '#9CA3AF'} />
              <Text style={styles.emptyText}>No posts in this category yet</Text>
              <Text style={styles.emptySubtext}>Check back soon for new inspiration.</Text>
            </View>
          ) : (
            filtered.map((item) => (
              <MotivationCard
                key={item.id}
                item={item}
                isFav={favIds.has(item.id)}
                onToggleFav={toggleFav}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    ...Typography.textStyles?.h3,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  filtersWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
  },
  actionBtnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
})

export default MotivationsScreen
