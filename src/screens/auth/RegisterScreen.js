// Register Screen
import React, { useState } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
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
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { signUp } = useAuth()

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
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
      const { error } = await signUp(
        formData.email.trim(), 
        formData.password, 
        formData.fullName.trim()
      )
      
      if (error) {
        Alert.alert('Registration Failed', error.message || 'An error occurred during registration')
      } else {
        Alert.alert(
          'Registration Successful', 
          'Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        )
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
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
      <ScrollView 
        contentContainerStyle={GlobalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}>
          {/* Header */}
          <View style={[GlobalStyles.center, { marginBottom: 32 }]}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="heart" size={40} color={Colors.white} />
            </View>
            <Text style={[GlobalStyles.h1, { textAlign: 'center' }]}>
              Join Our Journey
            </Text>
            <Text style={[GlobalStyles.captionText, { textAlign: 'center' }]}>
              Create your account to start your wellness journey
            </Text>
          </View>

          {/* Registration Form */}
          <View style={{ marginBottom: 24 }}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              error={errors.fullName}
              leftIcon={
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
              }
            />

            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
              }
            />

            <CustomInput
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              error={errors.password}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
              }
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
              }
            />
          </View>

          {/* Terms and Conditions */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[GlobalStyles.smallText, { textAlign: 'center', lineHeight: 18 }]}>
              By creating an account, you agree to our{' '}
              <Text style={{ color: Colors.primary, fontWeight: Typography.fontWeight.medium }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={{ color: Colors.primary, fontWeight: Typography.fontWeight.medium }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Register Button */}
          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginBottom: 24 }}
          />

          {/* Sign In Link */}
          <View style={[GlobalStyles.row, GlobalStyles.center]}>
            <Text style={GlobalStyles.captionText}>
              Already have an account? 
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ marginLeft: 4 }}
            >
              <Text style={{
                color: Colors.primary,
                fontSize: Typography.fontSize.sm,
                fontWeight: Typography.fontWeight.medium,
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen
