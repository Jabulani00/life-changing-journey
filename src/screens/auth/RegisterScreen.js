// Register Screen – Create your account
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import CustomInput from '../../components/common/CustomInput'
import CustomButton from '../../components/common/CustomButton'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signUp } = useAuth()

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const { data, error } = await signUp(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim()
      )
      if (error) {
        Alert.alert(
          'Create account failed',
          error.message || 'Please check your details and try again.'
        )
      } else {
        Alert.alert(
          'Account created',
          "You're signed in. You can now book sessions and update your profile.",
          [{ text: 'OK', onPress: () => navigation.navigate('Tabs') }]
        )
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        {navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.topBarTitle}>Sign up</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={[GlobalStyles.center, { marginBottom: 32 }]}>
            <View style={styles.logoCircle}>
              <Ionicons name="heart" size={40} color={Colors.white} />
            </View>
            <Text style={[GlobalStyles.h1, { textAlign: 'center' }]}>Create account</Text>
            <Text style={[GlobalStyles.captionText, { textAlign: 'center', marginTop: 8 }]}>
              Sign up to book sessions and manage your profile.
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <CustomInput
              label="Full name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(v) => updateFormData('fullName', v)}
              error={errors.fullName}
              leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
            />
            <CustomInput
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChangeText={(v) => updateFormData('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
            />
            <CustomInput
              label="Password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(v) => updateFormData('password', v)}
              secureTextEntry
              error={errors.password}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
            />
            <CustomInput
              label="Confirm password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChangeText={(v) => updateFormData('confirmPassword', v)}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
            />
          </View>

          <Text style={[GlobalStyles.smallText, { textAlign: 'center', lineHeight: 18, marginBottom: 20 }]}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </Text>

          <CustomButton title="Create account" onPress={handleRegister} loading={loading} style={{ marginBottom: 24 }} />

          <View style={styles.footerRow}>
            <Text style={GlobalStyles.captionText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginLeft: 4 }}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 48,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { ...Typography.textStyles.h6, color: Colors.textPrimary },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 40 },
  inner: { maxWidth: 400, width: '100%', alignSelf: 'center' },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
})

export default RegisterScreen
