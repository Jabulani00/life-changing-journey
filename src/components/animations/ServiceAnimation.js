import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

const ServiceAnimation = ({ 
  serviceType = 'general', 
  intensity = 'gentle',
  colors = ['#667eea', '#764ba2'],
  size = 'medium' 
}) => {
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(0.7)

  // Animation configurations based on service type
  const getAnimationConfig = () => {
    switch (serviceType) {
      case 'psychology':
        return {
          scaleRange: [1, 1.1],
          duration: 3000,
          rotationRange: [0, 360],
          opacityRange: [0.6, 0.9]
        }
      case 'spiritual':
        return {
          scaleRange: [0.8, 1.2],
          duration: 4000,
          rotationRange: [0, 180],
          opacityRange: [0.4, 1.0]
        }
      case 'financial':
        return {
          scaleRange: [1, 1.05],
          duration: 2000,
          rotationRange: [0, 0],
          opacityRange: [0.7, 0.9]
        }
      case 'hypnotherapy':
        return {
          scaleRange: [1, 1.3],
          duration: 5000,
          rotationRange: [0, 360],
          opacityRange: [0.5, 1.0]
        }
      default:
        return {
          scaleRange: [1, 1.08],
          duration: 2500,
          rotationRange: [0, 90],
          opacityRange: [0.6, 0.8]
        }
    }
  }

  const config = getAnimationConfig()

  useEffect(() => {
    // Gentle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(config.scaleRange[1], { 
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease)
        }),
        withTiming(config.scaleRange[0], { 
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease)
        })
      ),
      -1,
      false
    )

    // Rotation animation (if applicable)
    if (config.rotationRange[1] > 0) {
      rotation.value = withRepeat(
        withTiming(config.rotationRange[1], { 
          duration: config.duration,
          easing: Easing.linear
        }),
        -1,
        false
      )
    }

    // Opacity breathing effect
    opacity.value = withRepeat(
      withSequence(
        withTiming(config.opacityRange[1], { 
          duration: config.duration / 3,
          easing: Easing.inOut(Easing.ease)
        }),
        withTiming(config.opacityRange[0], { 
          duration: config.duration / 3,
          easing: Easing.inOut(Easing.ease)
        })
      ),
      -1,
      true
    )
  }, [serviceType])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value
    }
  })

  const getSize = () => {
    switch (size) {
      case 'small': return { width: 60, height: 60 }
      case 'large': return { width: 120, height: 120 }
      default: return { width: 80, height: 80 }
    }
  }

  const getGradientColors = () => {
    switch (serviceType) {
      case 'psychology':
        return ['#667eea', '#764ba2'] // Calming blues and purples
      case 'spiritual':
        return ['#f093fb', '#f5576c'] // Mystical pinks and magentas
      case 'financial':
        return ['#4facfe', '#00f2fe'] // Trustworthy blues
      case 'hypnotherapy':
        return ['#667eea', '#764ba2', '#f093fb'] // Hypnotic gradient
      default:
        return colors
    }
  }

  return (
    <View style={[styles.container, getSize()]}>
      <Animated.View style={[styles.animationContainer, animatedStyle]}>
        <LinearGradient
          colors={getGradientColors()}
          style={[styles.gradient, getSize()]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Floating particles for mystical effect */}
        {serviceType === 'spiritual' && (
          <>
            <View style={[styles.particle, styles.particle1]} />
            <View style={[styles.particle, styles.particle2]} />
            <View style={[styles.particle, styles.particle3]} />
          </>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    position: 'relative',
  },
  gradient: {
    borderRadius: 50,
    opacity: 0.8,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
  particle1: {
    top: 10,
    left: 20,
  },
  particle2: {
    top: 30,
    right: 15,
  },
  particle3: {
    bottom: 20,
    left: 30,
  },
})

export default ServiceAnimation
