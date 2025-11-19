import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const FloatingParticles = ({ 
  particleCount = 8,
  colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
  speed = 'gentle',
  size = 'small'
}) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    x: useSharedValue(Math.random() * width),
    y: useSharedValue(Math.random() * height),
    opacity: useSharedValue(Math.random() * 0.8 + 0.2),
    scale: useSharedValue(Math.random() * 0.5 + 0.5)
  }))

  useEffect(() => {
    const getSpeed = () => {
      switch (speed) {
        case 'gentle': return 8000
        case 'moderate': return 6000
        case 'fast': return 4000
        default: return 7000
      }
    }

    const getSize = () => {
      switch (size) {
        case 'small': return 3
        case 'medium': return 5
        case 'large': return 8
        default: return 4
      }
    }

    const animationDuration = getSpeed()
    const particleSize = getSize()

    particles.forEach((particle, index) => {
      const delay = index * 200

      // Horizontal floating
      particle.x.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(Math.random() * width, { 
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease)
          })),
          withTiming(Math.random() * width, { 
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease)
          })
        ),
        -1,
        false
      )

      // Vertical floating
      particle.y.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(Math.random() * height, { 
            duration: animationDuration * 1.2,
            easing: Easing.inOut(Easing.ease)
          })),
          withTiming(Math.random() * height, { 
            duration: animationDuration * 1.2,
            easing: Easing.inOut(Easing.ease)
          })
        ),
        -1,
        false
      )

      // Opacity breathing
      particle.opacity.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(0.1, { 
            duration: animationDuration / 4,
            easing: Easing.inOut(Easing.ease)
          })),
          withTiming(0.8, { 
            duration: animationDuration / 4,
            easing: Easing.inOut(Easing.ease)
          })
        ),
        -1,
        true
      )

      // Scale pulsing
      particle.scale.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(0.3, { 
            duration: animationDuration / 6,
            easing: Easing.inOut(Easing.ease)
          })),
          withTiming(1.2, { 
            duration: animationDuration / 6,
            easing: Easing.inOut(Easing.ease)
          })
        ),
        -1,
        true
      )
    })
  }, [speed, size])

  const getParticleStyle = (particle, index) => {
    const color = colors[index % colors.length]
    
    return useAnimatedStyle(() => {
      return {
        position: 'absolute',
        left: particle.x.value,
        top: particle.y.value,
        opacity: particle.opacity.value,
        transform: [{ scale: particle.scale.value }],
        width: size === 'small' ? 3 : size === 'medium' ? 5 : 8,
        height: size === 'small' ? 3 : size === 'medium' ? 5 : 8,
        backgroundColor: color,
        borderRadius: size === 'small' ? 1.5 : size === 'medium' ? 2.5 : 4,
      }
    })
  }

  return (
    <View style={styles.container}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={getParticleStyle(particle, index)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})

export default FloatingParticles
