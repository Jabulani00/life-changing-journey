// Login Screen
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { signIn } = useAuth()

  const validateForm = () => {
    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
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
        Alert.alert('Login Failed', error.message || 'An error occurred during login')
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
          <View style={[GlobalStyles.center, { marginBottom: 48 }]}>
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
              Life Changing Journey
            </Text>
            <Text style={[GlobalStyles.captionText, { textAlign: 'center' }]}>
              Welcome back! Sign in to continue your wellness journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ marginBottom: 24 }}>
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
              }
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
              }
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{ alignSelf: 'flex-end', marginTop: 8 }}
            >
              <Text style={{
                color: Colors.primary,
                fontSize: Typography.fontSize.sm,
                fontWeight: Typography.fontWeight.medium,
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginBottom: 24 }}
          />

          {/* Sign Up Link */}
          <View style={[GlobalStyles.row, GlobalStyles.center]}>
            <Text style={GlobalStyles.captionText}>
              Don't have an account? 
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={{ marginLeft: 4 }}
            >
              <Text style={{
                color: Colors.primary,
                fontSize: Typography.fontSize.sm,
                fontWeight: Typography.fontWeight.medium,
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
