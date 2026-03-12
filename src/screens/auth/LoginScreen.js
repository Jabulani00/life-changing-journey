// Login Screen – Sign in to your account
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signIn, signInAsGuest } = useAuth()

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6 && email.trim().toLowerCase() !== 'life.changing@admin.com') {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        Alert.alert('Sign in failed', error.message || 'Please check your email and password and try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
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
        <Text style={styles.topBarTitle}>Sign in</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={[GlobalStyles.center, { marginBottom: 40 }]}>
            <View style={styles.logoCircle}>
              <Ionicons name="heart" size={40} color={Colors.white} />
            </View>
            <Text style={[GlobalStyles.h1, { textAlign: 'center' }]}>Life Changing Journey</Text>
            <Text style={[GlobalStyles.captionText, { textAlign: 'center', marginTop: 8 }]}>
              Welcome back. Sign in to access your bookings and profile.
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <CustomInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => { setEmail(v); if (errors.email) setErrors((e) => ({ ...e, email: '' })) }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((e) => ({ ...e, password: '' })) }}
              secureTextEntry
              error={errors.password}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{ alignSelf: 'flex-end', marginTop: 6 }}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="Sign in" onPress={handleLogin} loading={loading} style={{ marginBottom: 16 }} />

          <TouchableOpacity onPress={signInAsGuest} style={styles.guestBtn}>
            <Text style={styles.guestBtnText}>Continue as guest</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={GlobalStyles.captionText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginLeft: 4 }}>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.adminHint}>Admin sign-in: use your admin email and password.</Text>
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
  guestBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
  },
  guestBtnText: { ...Typography.textStyles.body, color: Colors.textSecondary },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  adminHint: {
    ...Typography.textStyles.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
})

export default LoginScreen
