// Membership packages + subscription context (same DB as membership-web)
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useMemo, useState } from 'react'
import { Alert, Dimensions, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PLAN_DISPLAY_NAME, PLAN_ID } from '../../config/subscriptionConfig'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../hooks/useSubscription'
import { MEMBERSHIP_PACKAGES } from '../../data/membershipPackages'
import { ENTITLEMENT_LABELS, mapPlanToEntitlements } from '../../services/membershipService'
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

const cardWidth = Math.min(280, (Dimensions.get('window').width - 48) / 3)

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
  const sub = useSubscription()
  const isGuest = user?.isAnonymous || !user
  const isDemoAdmin = user?.id === 'demo-admin'

  const [memberType, setMemberType] = useState('adults')

  const effectivePlanId = sub.plan
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
            Once-off fees in ZAR. Compare plans side by side; purchase on the website to activate your tier.
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
            ) : sub.loading ? (
              <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary }}>Loading…</Text>
            ) : effectivePlanId ? (
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
                    {sub.membership?.memberType ? String(sub.membership.memberType) : ''}
                    {sub.membership?.endAt ? ` · Valid to ${formatDate(sub.membership.endAt)}` : ''}
                  </Text>
                </View>
                <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 12 }}>
                  App features below reflect your active plan. Full package list is in each column.
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
                  {effectivePlanId ? 'Manage or upgrade on web' : 'Get membership on web'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, marginBottom: 12 }}>
            Compare plans
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8, gap: 12 }}
          >
            {MEMBERSHIP_PACKAGES.map((pkg) => {
              const theme = TIER_THEME[pkg.id] || TIER_THEME.silver
              const price = pkg.prices[memberType]
              const isCurrent = effectivePlanId === pkg.id
              return (
                <View
                  key={pkg.id}
                  style={{
                    width: cardWidth,
                    minHeight: 320,
                    backgroundColor: Colors.surface,
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: isCurrent ? theme.border : Colors.lightGray,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text style={{ ...Typography.textStyles.h6, color: Colors.textPrimary }}>{pkg.name}</Text>
                      <Text style={{ ...Typography.textStyles.caption, color: Colors.textSecondary, marginTop: 2 }}>
                        Once-off
                      </Text>
                    </View>
                    {isCurrent ? (
                      <View style={{ backgroundColor: theme.badgeBg, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ ...Typography.textStyles.captionBold, color: theme.accent, fontSize: 10 }}>Current</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={{ ...Typography.textStyles.h5, color: theme.accent, marginTop: 8 }}>{formatZAR(price)}</Text>
                  <Text style={{ ...Typography.textStyles.caption, color: Colors.textLight, marginBottom: 8 }}>
                    {MEMBER_TYPES.find((m) => m.id === memberType)?.label}
                  </Text>
                  {pkg.benefits.slice(0, 6).map((line, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                      <Ionicons name="checkmark" size={14} color={theme.accent} style={{ marginTop: 2, marginRight: 6 }} />
                      <Text style={{ ...Typography.textStyles.caption, color: Colors.textPrimary, flex: 1 }}>{line}</Text>
                    </View>
                  ))}
                  {pkg.benefits.length > 6 ? (
                    <Text style={{ ...Typography.textStyles.caption, color: Colors.textLight }}>+ more on web</Text>
                  ) : null}
                </View>
              )
            })}
          </ScrollView>

          <TouchableOpacity onPress={openWebPlans} style={{ marginTop: 16 }}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>
                {effectivePlanId === PLAN_ID.PLATINUM
                  ? 'Manage on web'
                  : `Upgrade to ${effectivePlanId === PLAN_ID.SILVER ? PLAN_DISPLAY_NAME[PLAN_ID.GOLD] : PLAN_DISPLAY_NAME[PLAN_ID.PLATINUM]}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={openPublicSite} style={{ alignItems: 'center', marginTop: 12 }}>
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
