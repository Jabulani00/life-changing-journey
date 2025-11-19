// Premium Loading Spinner Component
import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const LoadingSpinner = ({ 
  size = 'large', 
  color = Colors.primary, 
  text = 'Loading...', 
  showText = true,
  variant = 'default' 
}) => {
  if (variant === 'gradient') {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
      }}>
        <LinearGradient
          colors={Colors.gradients.primary}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: showText ? 16 : 0,
          }}
        >
          <ActivityIndicator size="large" color={Colors.white} />
        </LinearGradient>
        
        {showText && (
          <Text style={{
            ...Typography.textStyles.body,
            color: Colors.textSecondary,
          }}>
            {text}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
    }}>
      <ActivityIndicator size={size} color={color} />
      {showText && (
        <Text style={{
          ...Typography.textStyles.body,
          color: Colors.textSecondary,
          marginTop: 16,
        }}>
          {text}
        </Text>
      )}
    </View>
  )
}

export default LoadingSpinner
