// Supabase Connection Test - Life Changing Journey
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase, supabaseHelpers } from '../utils/supabase'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionStatus('testing')
    setTestResults([])
    
    const results = []
    
    // Test 1: Basic connection
    try {
      results.push({ test: 'Basic Connection', status: 'testing', message: 'Testing...' })
      setTestResults([...results])
      
      const isConnected = await supabaseHelpers.testConnection()
      results[0] = { 
        test: 'Basic Connection', 
        status: isConnected ? 'success' : 'warning', 
        message: isConnected ? 'Connected successfully' : 'Demo mode (expected)' 
      }
      setTestResults([...results])
      
    } catch (error) {
      results[0] = { test: 'Basic Connection', status: 'error', message: error.message }
    }

    // Test 2: Auth system
    try {
      results.push({ test: 'Auth System', status: 'testing', message: 'Testing...' })
      setTestResults([...results])
      
      const { user, error } = await supabaseHelpers.getCurrentUser()
      results[1] = { 
        test: 'Auth System', 
        status: error ? 'warning' : 'success', 
        message: user ? `User: ${user.email}` : 'No user logged in (expected)' 
      }
      setTestResults([...results])
      
    } catch (error) {
      results[1] = { test: 'Auth System', status: 'error', message: error.message }
    }

    // Test 3: Environment variables
    results.push({ 
      test: 'Environment Config', 
      status: process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here' ? 'success' : 'warning',
      message: process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here' 
        ? 'Environment variables loaded' 
        : 'Using fallback values'
    })
    setTestResults([...results])

    setConnectionStatus('complete')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'checkmark-circle'
      case 'warning': return 'warning'
      case 'error': return 'close-circle'
      case 'testing': return 'ellipsis-horizontal-circle'
      default: return 'help-circle'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return Colors.success
      case 'warning': return Colors.secondary
      case 'error': return Colors.error
      case 'testing': return Colors.primary
      default: return Colors.textSecondary
    }
  }

  return (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 20,
      margin: 16,
      shadowColor: Colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Ionicons name="cloud" size={24} color={Colors.primary} style={{ marginRight: 8 }} />
        <Text style={{
          ...Typography.textStyles.h5,
          color: Colors.textPrimary,
        }}>
          Supabase Connection Test
        </Text>
      </View>

      {testResults.map((result, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          borderBottomWidth: index < testResults.length - 1 ? 1 : 0,
          borderBottomColor: Colors.lightGray,
        }}>
          <Ionicons 
            name={getStatusIcon(result.status)} 
            size={20} 
            color={getStatusColor(result.status)} 
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textPrimary,
              fontWeight: 'bold',
            }}>
              {result.test}
            </Text>
            <Text style={{
              ...Typography.textStyles.caption,
              color: Colors.textSecondary,
            }}>
              {result.message}
            </Text>
          </View>
        </View>
      ))}

      {connectionStatus === 'complete' && (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginTop: 16,
            alignItems: 'center',
          }}
          onPress={testConnection}
        >
          <Text style={{
            ...Typography.textStyles.button,
            color: Colors.white,
          }}>
            Test Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SupabaseTest
