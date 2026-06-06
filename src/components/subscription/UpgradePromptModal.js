/**
 * Non-blocking upgrade prompt — links to MembershipPackages stack route.
 * Uses PLAN_ID / PLAN_DISPLAY_NAME from config (no hardcoded tier strings in copy).
 */
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { PLAN_DISPLAY_NAME, PLAN_ID } from '../../config/subscriptionConfig'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

/**
 * @param {object} props
 * @param {boolean} props.visible
 * @param {() => void} props.onClose
 * @param {import('../../config/subscriptionConfig').PlanId} props.suggestedPlan
 * @param {string} [props.message]
 * @param {import('@react-navigation/native').NavigationProp<any>} props.navigation
 */
export default function UpgradePromptModal({ visible, onClose, suggestedPlan, message, navigation }) {
  const tierName = PLAN_DISPLAY_NAME[suggestedPlan] || PLAN_DISPLAY_NAME[PLAN_ID.GOLD]

  const goPlans = () => {
    onClose()
    navigation?.navigate?.('Subscription')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
          padding: 24,
          paddingBottom: 32,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="ribbon-outline" size={28} color={Colors.accent} style={{ marginRight: 10 }} />
            <Text style={{ ...Typography.textStyles.h5, color: Colors.textPrimary, flex: 1 }}>
              Unlock more with {tierName}
            </Text>
          </View>
          <Text style={{ ...Typography.textStyles.bodySmall, color: Colors.textSecondary, marginBottom: 20 }}>
            {message ||
              'This benefit is included on a higher tier. Upgrade anytime — your current app features stay the same.'}
          </Text>
          <TouchableOpacity
            onPress={goPlans}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 10,
            }}
            activeOpacity={0.9}
          >
            <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>View plans & upgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ ...Typography.textStyles.captionBold, color: Colors.textSecondary }}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
