// Forgot Password Screen
import React, { useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import CustomInput from '../../components/common/CustomInput'
import CustomButton from '../../components/common/CustomButton'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const { error } = await resetPassword(email.trim())
      
      if (error) {
        Alert.alert('Error', error.message)
      } else {
        Alert.alert(
          'Success', 
          'Password reset email sent. Please check your inbox.',
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
    <View style={[GlobalStyles.container, GlobalStyles.paddingContainer]}>
      <StatusBar style="dark" />
      
      <View style={[GlobalStyles.center, { marginTop: 100, marginBottom: 50 }]}>
        <Ionicons name="lock-closed-outline" size={60} color={Colors.primary} />
        <Text style={[GlobalStyles.h2, { textAlign: 'center', marginTop: 16 }]}>
          Forgot Password?
        </Text>
        <Text style={[GlobalStyles.captionText, { textAlign: 'center', marginTop: 8 }]}>
          Enter your email and we'll send you a reset link
        </Text>
      </View>

      <CustomInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomButton
        title="Send Reset Link"
        onPress={handleResetPassword}
        loading={loading}
        style={{ marginTop: 24 }}
      />

      <CustomButton
        title="Back to Login"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={{ marginTop: 16 }}
      />
    </View>
  )
}

export default ForgotPasswordScreen
