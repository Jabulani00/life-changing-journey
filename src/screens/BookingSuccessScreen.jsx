import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../styles/colors'
import { Typography } from '../styles/typography'

export default function BookingSuccessScreen({ navigation, route }) {
  const title = route?.params?.title || 'Booking confirmed'
  const subtitle =
    route?.params?.subtitle ||
    'Your session is saved. You will receive a confirmation from Calendly.'

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 32, paddingHorizontal: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Ionicons name="checkmark-circle" size={48} color={Colors.white} />
          </View>
          <Text style={{ ...Typography.textStyles.h3, color: Colors.white, textAlign: 'center' }}>
            {title}
          </Text>
          <Text
            style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.white,
              opacity: 0.95,
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ ...Typography.textStyles.button, color: Colors.white }}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyBookings')}
          style={{ paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ ...Typography.textStyles.captionBold, color: Colors.primary }}>View my bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
