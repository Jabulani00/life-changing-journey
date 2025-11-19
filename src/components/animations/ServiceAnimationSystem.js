import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ServiceAnimation from './ServiceAnimation'
import HealingWaves from './HealingWaves'
import FloatingParticles from './FloatingParticles'

const ServiceAnimationSystem = ({ 
  serviceType, 
  showBackground = true,
  intensity = 'gentle',
  onPress 
}) => {
  const [isActive, setIsActive] = useState(false)

  const getServiceConfig = () => {
    switch (serviceType) {
      case 'psychology':
        return {
          colors: ['#667eea', '#764ba2'],
          animationType: 'gentle-pulse',
          backgroundEffect: 'healing-waves',
          intensity: 'gentle'
        }
      case 'spiritual':
        return {
          colors: ['#f093fb', '#f5576c', '#ffecd2'],
          animationType: 'mystical-float',
          backgroundEffect: 'floating-particles',
          intensity: 'moderate'
        }
      case 'financial':
        return {
          colors: ['#4facfe', '#00f2fe'],
          animationType: 'stable-growth',
          backgroundEffect: 'healing-waves',
          intensity: 'gentle'
        }
      case 'hypnotherapy':
        return {
          colors: ['#667eea', '#764ba2', '#f093fb'],
          animationType: 'hypnotic-spiral',
          backgroundEffect: 'floating-particles',
          intensity: 'moderate'
        }
      case 'consulting':
        return {
          colors: ['#4facfe', '#00f2fe', '#667eea'],
          animationType: 'professional-pulse',
          backgroundEffect: 'healing-waves',
          intensity: 'gentle'
        }
      case 'education':
        return {
          colors: ['#f093fb', '#f5576c'],
          animationType: 'knowledge-flow',
          backgroundEffect: 'floating-particles',
          intensity: 'moderate'
        }
      default:
        return {
          colors: ['#667eea', '#764ba2'],
          animationType: 'gentle-pulse',
          backgroundEffect: 'healing-waves',
          intensity: 'gentle'
        }
    }
  }

  const config = getServiceConfig()

  const handlePress = () => {
    setIsActive(!isActive)
    if (onPress) {
      onPress(serviceType)
    }
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Background Effects */}
      {showBackground && (
        <>
          {config.backgroundEffect === 'healing-waves' && (
            <HealingWaves 
              colors={config.colors}
              intensity={config.intensity}
            />
          )}
          {config.backgroundEffect === 'floating-particles' && (
            <FloatingParticles 
              colors={config.colors}
              speed={config.intensity}
              particleCount={6}
            />
          )}
        </>
      )}

      {/* Main Service Animation */}
      <ServiceAnimation
        serviceType={serviceType}
        intensity={config.intensity}
        colors={config.colors}
        size="medium"
      />

      {/* Service Label */}
      <Text style={styles.serviceLabel}>
        {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  serviceLabel: {
    position: 'absolute',
    bottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
})

export default ServiceAnimationSystem
