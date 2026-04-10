// Membership packages + live Firestore status (same DB as membership-web)
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { MEMBERSHIP_PACKAGES } from '../../data/membershipPackages'
import {
  ENTITLEMENT_LABELS,
  getEffectivePlanId,
  mapPlanToEntitlements,
  subscribeMembership,
} from '../../services/membershipService'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { Constants } from '../../utils/constants'

const MEMBER_TYPES = [
  { id: 'children', label: 'Children' },
  { id: 'adults', label: 'Adults' },
  { id: 'couples', label: 'Couples' },
]

const TIER_THEME = {
  silver: {
    border: Colors.lightGray,
    accent: Colors.textSecondary,
    badgeBg: 'rgba(113, 128, 150, 0.12)',
  },
  gold: {
    border: Colors.accent,
    accent: Colors.accentDark,
    badgeBg: Colors.accent + '22',
  },
  platinum: {
    border: Colors.brandTeal,
    accent: Colors.infoDark,
    badgeBg: Colors.brandTeal + '22',
  },
}

function formatZAR(n) {
  return `R${Number(n).toLocaleString('en-ZA')}`
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MembershipPackagesScreen() {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const uid = user?.uid || user?.id
  const isGuest = user?.isAnonymous || !user
  const isDemoAdmin = user?.id === 'demo-admin'

  const [memberType, setMemberType] = useState('adults')
  const [membership, setMembership] = useState(null)
  const [membershipLoading, setMembershipLoading] = useState(true)
  const [membershipError, setMembershipError] = useState(null)

  useEffect(() => {
    if (!uid || isDemoAdmin || isGuest) {
      setMembership(null)
      setMembershipLoading(false)
      return
    }

    setMembershipLoading(true)
    setMembershipError(null)
    const unsub = subscribeMembership(
      uid,
      (data) => {
        setMembership(data)
        setMembershipLoading(false)
      },
      (err) => {
        setMembershipError(err?.message || 'Could not load membership')
        setMembershipLoading(false)
      }
    )
    return () => unsub()
  }, [uid, isDemoAdmin, isGuest])

  const effectivePlanId = useMemo(() => getEffectivePlanId(membership), [membership])
  const entitlements = useMemo(() => mapPlanToEntitlements(effectivePlanId), [effectivePlanId])

  const plansUrl = `${Constants.PUBLIC_SITE_URL}/plans`

  const openWebPlans = () => {
    Linking.openURL(plansUrl).catch(() => {
      Alert.alert('Unable to open link', 'Please try again or visit the site in your browser.')
    })
  }

  const openPublicSite = () => {
    Linking.openURL(Constants.PUBLIC_SITE_URL).catch(() => {})
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingBottom: Math.max(insets.bottom, 8) }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={{ ...Typography.textStyles.h3, color: Colors.textPrimary, marginBottom: 6 }}>
            Life Changing Journey Packages
          </Text>
          <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 16 }}>
            Once-off fees in ZAR. Purchase and renew on the website; your status syncs here from the same account.
          </Text>

          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginBottom: 8 }}>
            Show prices for
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {MEMBER_TYPES.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => setMemberType(t.id)}
                activeOpacity={0.85}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: memberType === t.id ? Colors.primary : Colors.surface,
                  borderWidth: 1,
                  borderColor: memberType === t.id ? Colors.primary : Colors.lightGray,
                }}
              >
                <Text
                  style={{
                    ...Typography.textStyles.captionBold,
                    color: memberType === t.id ? Colors.white : Colors.textPrimary,
                  }}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: Colors.lightGray,
            }}
          >
            <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, marginBottom: 8 }}>
              Your membership
            </Text>
            {isGuest || isDemoAdmin ? (
              <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary }}>
                {isDemoAdmin
                  ? 'Sign in with a real account to see membership synced from the web.'
                  : 'Sign in with the same email you use on the website to see your plan and app benefits.'}
              </Text>
            ) : membershipLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginLeft: 10 }}>
                  Loading…
                </Text>
              </View>
            ) : membershipError ? (
              <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.error }}>{membershipError}</Text>
            ) : membership && effectivePlanId ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <View
                    style={{
                      backgroundColor: TIER_THEME[effectivePlanId]?.badgeBg || Colors.primaryAlpha,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ ...Typography.textStyles.captionBold, color: Colors.primary, textTransform: 'capitalize' }}>
                      {effectivePlanId}
                    </Text>
                  </View>
                  <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary }}>
                    {membership.memberType ? String(membership.memberType) : ''} · Valid to {formatDate(membership.endAt)}
                  </Text>
                </View>
                <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 12 }}>
                  App features below reflect your active plan. Full package list is under each tier.
                </Text>
                <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textPrimary, marginBottom: 8 }}>
                  Active app entitlements
                </Text>
                {Object.entries(entitlements).map(([key, on]) => (
                  <View
                    key={key}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.lightGray,
                    }}
                  >
                    <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textPrimary, flex: 1, paddingRight: 8 }}>
                      {ENTITLEMENT_LABELS[key] || key}
                    </Text>
                    <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={on ? Colors.success : Colors.textLight} />
                  </View>
                ))}
              </>
            ) : (
              <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary }}>
                No active membership found. Purchase a package on the website with this account to unlock tier benefits here.
              </Text>
            )}

            <TouchableOpacity onPress={openWebPlans} activeOpacity={0.9} style={{ marginTop: 14 }}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>
                  {membership && effectivePlanId ? 'Manage or upgrade on web' : 'Get membership on web'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {MEMBERSHIP_PACKAGES.map((pkg) => {
            const theme = TIER_THEME[pkg.id] || TIER_THEME.silver
            const price = pkg.prices[memberType]
            const isCurrent = effectivePlanId === pkg.id
            return (
              <View
                key={pkg.id}
                style={{
                  backgroundColor: Colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: isCurrent ? theme.border : Colors.lightGray,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ ...Typography.textStyles.h4, color: Colors.textPrimary }}>{pkg.name}</Text>
                    <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 2 }}>
                      Once-off fee
                    </Text>
                  </View>
                  {isCurrent ? (
                    <View style={{ backgroundColor: theme.badgeBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ ...Typography.textStyles.captionBold, color: theme.accent }}>Your plan</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={{ ...Typography.textStyles.h5, color: theme.accent, marginTop: 10 }}>
                  {formatZAR(price)}
                </Text>
                <Text style={{ ...Typography.textStyles.caption, color: Colors.textLight, marginBottom: 10 }}>
                  for {MEMBER_TYPES.find((m) => m.id === memberType)?.label?.toLowerCase()}
                </Text>
                {pkg.benefits.map((line, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Ionicons name="checkmark" size={16} color={theme.accent} style={{ marginTop: 2, marginRight: 8 }} />
                    <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textPrimary, flex: 1 }}>{line}</Text>
                  </View>
                ))}
              </View>
            )
          })}

          <TouchableOpacity onPress={openPublicSite} style={{ alignItems: 'center', marginTop: 4 }}>
            <Text style={{ ...Typography.textStyles.caption, color: Colors.info }}>
              {Constants.PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}
            </Text>
          </TouchableOpacity>

          <Text style={{ ...Typography.textStyles.caption, color: Colors.textLight, marginTop: 16, lineHeight: 18 }}>
            This platform provides guidance and support. It does not replace professional medical or psychiatric diagnosis.
            Financial services are subject to responsible lending practices.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
