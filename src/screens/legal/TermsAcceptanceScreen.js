import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomButton from '../../components/common/CustomButton'
import {
  TERMS_ACCEPTANCE_LABEL,
  TERMS_LAST_UPDATED,
  TERMS_LEGAL_URL,
  TERMS_SECTIONS,
  TERMS_VERSION,
} from '../../data/termsAndPolicies'
import { acceptTerms } from '../../services/termsService'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { Constants } from '../../utils/constants'

export default function TermsAcceptanceScreen({ onAccepted }) {
  const insets = useSafeAreaInsets()
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const openFullTerms = () => {
    Linking.openURL(TERMS_LEGAL_URL).catch(() => {
      Alert.alert('Unable to open link', 'Please visit our website to read the full terms.')
    })
  }

  const handleAccept = async () => {
    if (!checked) {
      Alert.alert('Acceptance required', 'Please confirm that you agree to our Terms and Policies to continue.')
      return
    }
    setSubmitting(true)
    try {
      await acceptTerms()
      onAccepted?.()
    } catch (e) {
      Alert.alert('Error', 'Could not save your acceptance. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms & Policies</Text>
        <Text style={styles.subtitle}>
          Please review and accept before using {Constants.APP_NAME}
        </Text>
        <Text style={styles.meta}>
          Version {TERMS_VERSION} · Last updated {TERMS_LAST_UPDATED}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map((p, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        <TouchableOpacity onPress={openFullTerms} style={styles.fullLink}>
          <Ionicons name="open-outline" size={16} color={Colors.info} />
          <Text style={styles.fullLinkText}>Read full terms on our website</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setChecked((v) => !v)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked ? <Ionicons name="checkmark" size={16} color={Colors.white} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>{TERMS_ACCEPTANCE_LABEL}</Text>
        </TouchableOpacity>

        <CustomButton
          title={submitting ? 'Saving…' : 'I Agree — Continue'}
          onPress={handleAccept}
          disabled={submitting}
          style={{ marginTop: 12 }}
        />
        {submitting ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 8 }} />
        ) : null}

        <Text style={styles.footerNote}>
          You must accept to use the app on iOS, Google Play, and App Gallery.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  title: {
    ...Typography.textStyles.h4,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textSecondary,
  },
  meta: {
    ...Typography.textStyles.caption,
    color: Colors.textLight,
    marginTop: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    ...Typography.textStyles.h6,
    color: Colors.primary,
    marginBottom: 8,
  },
  paragraph: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  fullLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  fullLinkText: {
    ...Typography.textStyles.captionBold,
    color: Colors.info,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxLabel: {
    ...Typography.textStyles.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  footerNote: {
    ...Typography.textStyles.caption,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
})
