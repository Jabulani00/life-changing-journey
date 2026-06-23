// Premium Home Screen - Life Changing Journey
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ServiceCard from '../../components/cards/ServiceCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../hooks/useSubscription'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'

const { width } = Dimensions.get('window')

const TIER_CHIP = {
  platinum: { label: 'Platinum Member ★', bg: '#E8E8F0', text: '#4B4B8F' },
  gold: { label: 'Gold Member ★', bg: '#FEF3C7', text: '#92400E' },
  silver: { label: 'Silver Member', bg: '#F3F4F6', text: '#374151' },
}

const HomeScreen = ({ navigation }) => {
  const { user, getUserProfile, admin, effectivePlanId } = useAuth()
  const { profile } = useSubscription()
  const showAdmin = admin || profile?.isAdmin === true
  const insets = useSafeAreaInsets()
  const [userProfile, setUserProfile] = useState(staticData.userProfile)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(staticData.inspirationalQuotes[0])
  const [todayMood, setTodayMood] = useState(null)
  const [moodSaved, setMoodSaved] = useState(false)

  const MOOD_KEY = `lcj_mood_${new Date().toISOString().slice(0, 10)}`

  const MOODS = [
    { key: 'great', label: 'Great', icon: 'sunny', color: '#F59E0B' },
    { key: 'good', label: 'Good', icon: 'happy', color: '#10B981' },
    { key: 'okay', label: 'Okay', icon: 'partly-sunny', color: '#3B82F6' },
    { key: 'low', label: 'Low', icon: 'rainy', color: '#8B5CF6' },
    { key: 'stressed', label: 'Stressed', icon: 'thunderstorm', color: '#EF4444' },
  ]

  const loadMood = async () => {
    try {
      const saved = await AsyncStorage.getItem(MOOD_KEY)
      if (saved) { setTodayMood(saved); setMoodSaved(true) }
    } catch {}
  }

  const saveMood = async (moodKey) => {
    setTodayMood(moodKey)
    try {
      await AsyncStorage.setItem(MOOD_KEY, moodKey)
      setMoodSaved(true)
    } catch {}
  }

  useEffect(() => {
    loadUserProfile()
    rotateQuote()
    loadMood()
  }, [])

  const loadUserProfile = async () => {
    // Skip profile loading for directory gateway mode
    try {
      setLoading(false)
      // Future: Enable this when booking system is implemented
      /*
      setLoading(true)
      const { data } = await getUserProfile()
      if (data) {
        setUserProfile(data)
      }
      */
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }

  const rotateQuote = () => {
    const quotes = staticData.inspirationalQuotes
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadUserProfile()
    rotateQuote()
    setRefreshing(false)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const QuickActionButton = ({ action }) => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        minWidth: 80,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: action.color + '20',
      }}
      onPress={() => navigation.navigate(action.route)}
      activeOpacity={0.9}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: action.color + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={action.icon} size={20} color={action.color} />
      </View>
      <Text style={{
        ...Typography.textStyles.captionBold,
        color: Colors.textPrimary,
        textAlign: 'center',
      }}>
        {action.title}
      </Text>
    </TouchableOpacity>
  )

  // AppointmentCard component - Hidden for directory gateway mode
  const AppointmentCard = ({ appointment }) => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
      }}
      onPress={() => navigation.navigate('Booking')}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.textStyles.h6,
            color: Colors.textPrimary,
            marginBottom: 4,
          }}>
            {appointment.services.name}
          </Text>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: Colors.textSecondary,
            marginBottom: 8,
          }}>
            {new Date(appointment.appointment_date).toLocaleDateString('en-ZA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={14} color={Colors.textLight} />
            <Text style={{
              ...Typography.textStyles.caption,
              color: Colors.textLight,
              marginLeft: 4,
            }}>
              {new Date(appointment.appointment_date).toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit'
              })} • {appointment.services.duration} min
            </Text>
          </View>
        </View>
        
        <View style={{
          backgroundColor: appointment.status === 'confirmed' ? Colors.success + '20' : Colors.warning + '20',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        }}>
          <Text style={{
            ...Typography.textStyles.caption,
            color: appointment.status === 'confirmed' ? Colors.successDark : Colors.warningDark,
            fontWeight: Typography.fontWeight.semiBold,
          }}>
            {appointment.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading && !userProfile) {
    return <LoadingSpinner variant="gradient" text="Loading your journey..." />
  }

  const isGuest = user?.isAnonymous || !user

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingBottom: Math.max(insets.bottom, 12) }}>
      <StatusBar style="dark" />
      {/* Top bar: Login or Profile */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Math.max(insets.top, 12),
        paddingBottom: 10,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../../assets/icon.png')}
            style={{ width: 32, height: 32, borderRadius: 8 }}
            resizeMode="contain"
          />
          <Text style={{
            ...Typography.textStyles.h6,
            color: Colors.textPrimary,
            marginLeft: 10,
          }}>
            Life Changing Journey
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(isGuest ? 'Login' : 'Profile')}
          style={{
            backgroundColor: isGuest ? Colors.primary : Colors.primaryAlpha,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            borderWidth: isGuest ? 0 : 1,
            borderColor: Colors.primary,
          }}
          activeOpacity={0.9}
        >
          <Text style={{
            ...Typography.textStyles.captionBold,
            color: isGuest ? Colors.white : Colors.primary,
          }}>
            {isGuest ? 'Login' : 'Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(100, insets.bottom + 24) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* App Description */}
        <View style={{ marginBottom: 24, paddingTop: 16 }}>
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            marginHorizontal: 16,
            padding: 16,
            shadowColor: Colors.shadow.medium,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}>
            {/* App Icon */}
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <Image 
                source={require('../../../assets/icon.png')}
                style={{ width: 56, height: 56, borderRadius: 12 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{
              ...Typography.textStyles.h5,
              color: Colors.textPrimary,
              textAlign: 'center',
              marginBottom: 6,
            }}>
              Welcome to Life Changing Journey
            </Text>
            {effectivePlanId && TIER_CHIP[effectivePlanId] && (
              <View style={{ alignItems: 'center', marginBottom: 6 }}>
                <View style={{ backgroundColor: TIER_CHIP[effectivePlanId].bg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: TIER_CHIP[effectivePlanId].text }}>
                    {TIER_CHIP[effectivePlanId].label}
                  </Text>
                </View>
              </View>
            )}
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}>
              Your gateway to psychology, spiritual growth, hypnotherapy, financial guidance, and integrated services — all focused on holistic transformation and community upliftment.
            </Text>
          </View>
        </View>

        {/* Quick actions: Events, My Bookings, Admin */}
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                minWidth: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => navigation.navigate('Events')}
              activeOpacity={0.9}
            >
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                minWidth: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => navigation.navigate('MyBookings')}
              activeOpacity={0.9}
            >
              <Ionicons name="book" size={24} color={Colors.primary} />
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                minWidth: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => navigation.navigate('Live')}
              activeOpacity={0.9}
            >
              <Ionicons name="videocam" size={24} color={Colors.primary} />
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>Live</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                minWidth: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => navigation.navigate('Motivations')}
              activeOpacity={0.9}
            >
              <Ionicons name="sparkles-outline" size={24} color={Colors.primary} />
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>Daily Word</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                minWidth: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => navigation.navigate('MembershipPackages')}
              activeOpacity={0.9}
            >
              <Ionicons name="ribbon-outline" size={24} color={Colors.accent} />
              <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>Membership</Text>
            </TouchableOpacity>
            {showAdmin && (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  minWidth: 100,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.lightGray,
                }}
                onPress={() => navigation.navigate('Admin')}
                activeOpacity={0.9}
              >
                <Ionicons name="construct-outline" size={24} color={Colors.primary} />
                <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginTop: 8 }}>Admin</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Book Appointment CTA */}
        <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => navigation.navigate('Booking')}
            style={{ borderRadius: 18, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight || '#1a5276']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 3 }}>
                  Book an Appointment
                </Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                  Schedule a session with our practitioners
                </Text>
              </View>
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center', alignItems: 'center',
              }}>
                <Ionicons name="calendar" size={22} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Daily Wellness Check-in */}
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: Colors.lightGray,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 }}>
              Daily Wellness Check-in
            </Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginBottom: 14 }}>
              {moodSaved ? 'Your mood for today has been recorded.' : 'How are you feeling today?'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {MOODS.map((mood) => {
                const selected = todayMood === mood.key
                return (
                  <TouchableOpacity
                    key={mood.key}
                    onPress={() => saveMood(mood.key)}
                    activeOpacity={0.8}
                    style={{
                      alignItems: 'center',
                      flex: 1,
                      marginHorizontal: 3,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: selected ? mood.color + '22' : '#F9FAFB',
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? mood.color : Colors.lightGray,
                    }}
                  >
                    <Ionicons name={mood.icon + '-outline'} size={22} color={selected ? mood.color : Colors.textSecondary} />
                    <Text style={{ fontSize: 10, marginTop: 4, fontWeight: selected ? '700' : '400', color: selected ? mood.color : Colors.textSecondary }}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            {moodSaved && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Chatbot')}
                style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.primary} />
                <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600', marginLeft: 6 }}>
                  Talk to our AI Wellness Coach
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Services - Main Focus */}
        <View style={{ marginBottom: 32, paddingTop: 20 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <Text style={{
              ...Typography.textStyles.h3,
              color: Colors.textPrimary,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Our Services
            </Text>
            <Text style={{
              ...Typography.textStyles.body,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}>
              Professional wellness services for your transformation
            </Text>
          </View>
          
          {/* Services Grid */}
          <View style={{ paddingHorizontal: 16 }}>
            {staticData.services.map((service) => (
              <View key={service.id} style={{ marginBottom: 16 }}>
                <ServiceCard 
                  service={service}
                  variant="large"
                  onPress={(service, action) => {
                    if (action === 'website' && service.website) {
                      Linking.openURL(service.website).catch(() => {
                        Alert.alert('Error', 'Unable to open website. Please check your internet connection.')
                      })
                    } else if (action === 'call' && service.phone) {
                      Linking.openURL(`tel:${service.phone}`).catch(() => {
                        Alert.alert('Error', 'Unable to make call. Please check your device settings.')
                      })
                    } else {
                      navigation.navigate('ServiceDetail', { service })
                    }
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Contact Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <Text style={{
              ...Typography.textStyles.h4,
              color: Colors.textPrimary,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Get In Touch
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}>
              Ready to start your wellness journey?
            </Text>
          </View>
          
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: 24,
              shadowColor: Colors.shadow.medium,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}>
              <LinearGradient
                colors={[Colors.primaryAlpha, Colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 20,
                }}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 16,
                    minWidth: 100,
                  }}
                  onPress={() => Linking.openURL('tel:+27310350208')}
                >
                  <Ionicons name="call" size={24} color={Colors.primary} />
                  <Text style={{
                    ...Typography.textStyles.captionBold,
                    color: Colors.primary,
                    marginTop: 8,
                  }}>
                    Call Us
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 16,
                    minWidth: 100,
                  }}
                  onPress={() => Linking.openURL('https://wa.me/27658460441')}
                >
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  <Text style={{
                    ...Typography.textStyles.captionBold,
                    color: Colors.primary,
                    marginTop: 8,
                  }}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 16,
                    minWidth: 100,
                  }}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Ionicons name="mail" size={24} color={Colors.primary} />
                  <Text style={{
                    ...Typography.textStyles.captionBold,
                    color: Colors.primary,
                    marginTop: 8,
                  }}>
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Connect Section (compact, links to full Connect screen) */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              ...Typography.textStyles.h4,
              color: Colors.textPrimary,
              marginBottom: 6,
              textAlign: 'center',
            }}>
              Connect With Us
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}>
              Follow Life Changing Journey on our social platforms
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <View style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: 16,
              shadowColor: Colors.shadow.medium,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 4,
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {[{ icon: 'logo-facebook', color: '#1877F2' }, { icon: 'logo-instagram', color: '#E1306C' }, { icon: 'logo-youtube', color: '#FF0000' }].map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => navigation.navigate('Connect')}
                      activeOpacity={0.9}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: item.color + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: Colors.lightGray,
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Connect')}
                  activeOpacity={0.9}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.primary + '10', borderRadius: 12, borderWidth: 1, borderColor: Colors.primary + '30' }}
                >
                  <Text style={{ ...Typography.textStyles.captionBold, color: Colors.primary }}>See all</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action - Hidden for directory gateway mode */}
        {false && (
          <View style={{
            marginHorizontal: 16,
            backgroundColor: Colors.surface,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: Colors.shadow.medium,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 24, alignItems: 'center' }}
            >
              <Ionicons name="heart" size={40} color={Colors.white} style={{ marginBottom: 12 }} />
              <Text style={{
                ...Typography.textStyles.h5,
                color: Colors.white,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Support Nyezi Foundation
              </Text>
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: Colors.white,
                opacity: 0.9,
                textAlign: 'center',
                marginBottom: 16,
              }}>
                Help us provide educational support to rural communities
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.white,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 24,
                }}
                onPress={() => navigation.navigate('Donate')}
              >
                <Text style={{
                  ...Typography.textStyles.button,
                  color: Colors.primary,
                }}>
                  Donate Now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default HomeScreen
