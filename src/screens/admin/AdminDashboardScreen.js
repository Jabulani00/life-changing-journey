// Admin Dashboard – landing screen for admin with navigation to manage Events, Bookings, Live
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const AdminDashboardScreen = ({ navigation }) => {
  const { user, signOut } = useAuth()
  const email = user?.email ?? user?.user_metadata?.email ?? ''

  const handleSignOut = async () => {
    await signOut()
  }

  const cards = [
    {
      key: 'events',
      title: 'Manage Events',
      subtitle: 'Create, edit and manage events',
      icon: 'calendar',
      route: 'AdminManage',
      params: { initialTab: 'events' },
    },
    {
      key: 'bookings',
      title: 'Manage Bookings',
      subtitle: 'View and update consultation bookings',
      icon: 'people',
      route: 'AdminManage',
      params: { initialTab: 'bookings' },
    },
    {
      key: 'live',
      title: 'Live Stream',
      subtitle: 'Set YouTube and Facebook live links',
      icon: 'videocam',
      route: 'AdminManage',
      params: { initialTab: 'live' },
    },
  ]

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Life Changing Journey</Text>
        {email ? (
          <Text style={styles.email} numberOfLines={1}>{email}</Text>
        ) : null}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            style={styles.card}
            onPress={() => navigation.navigate(card.route, card.params)}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconWrap}>
              <Ionicons name={card.icon} size={28} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.card, styles.signOutCard]}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="log-out-outline" size={28} color={Colors.error} />
          </View>
          <Text style={styles.signOutText}>Sign out</Text>
          <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    ...Typography.textStyles.h3,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.textStyles.body,
    color: Colors.white,
    opacity: 0.9,
  },
  email: {
    ...Typography.textStyles.caption,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 8,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryAlpha,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: { flex: 1 },
  cardTitle: {
    ...Typography.textStyles.bodyBold,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  signOutCard: {},
  signOutText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.error,
    flex: 1,
  },
})

export default AdminDashboardScreen
