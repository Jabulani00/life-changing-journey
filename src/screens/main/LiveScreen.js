// Live Screen – YouTube & Facebook Live conferences
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getLiveStreamConfig } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const openUrl = async (url, label) => {
  if (!url || !url.trim()) return
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    await Linking.openURL(url)
  } else {
    Alert.alert('Cannot open', `Unable to open ${label}. Invalid or unsupported URL.`)
  }
}

const LiveScreen = ({ navigation }) => {
  const [config, setConfig] = useState({ youtubeUrl: null, facebookUrl: null })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      const c = await getLiveStreamConfig()
      setConfig(c)
    } catch (e) {
      console.warn('Live config load error:', e)
      setConfig({ youtubeUrl: null, facebookUrl: null })
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

  const StreamCard = ({ icon, title, subtitle, url, color }) => (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: (color || Colors.primary) + '20' }]}>
        <Ionicons name={icon} size={32} color={color || Colors.primary} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      {url ? (
        <TouchableOpacity
          style={[styles.watchBtn, { backgroundColor: color || Colors.primary }]}
          onPress={() => openUrl(url, title)}
          activeOpacity={0.9}
        >
          <Ionicons name="play-circle" size={20} color={Colors.white} />
          <Text style={styles.watchBtnText}>Watch live</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noStream}>
          <Text style={styles.noStreamText}>No stream link set</Text>
          <Text style={styles.noStreamHint}>Check back later or contact us.</Text>
        </View>
      )}
    </View>
  )

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
        <Text style={styles.title}>Live</Text>
        <Text style={styles.subtitle}>YouTube & Facebook Live conferences</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <StreamCard
            icon="logo-youtube"
            title="YouTube Live"
            subtitle="Watch our live sessions on YouTube"
            url={config.youtubeUrl}
            color="#FF0000"
          />
          <StreamCard
            icon="logo-facebook"
            title="Facebook Live"
            subtitle="Join us on Facebook Live"
            url={config.facebookUrl}
            color="#1877F2"
          />
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    ...Typography.textStyles.h5,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  watchBtnText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.white,
  },
  noStream: { alignItems: 'center' },
  noStreamText: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textSecondary,
  },
  noStreamHint: {
    ...Typography.textStyles.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
})

export default LiveScreen
