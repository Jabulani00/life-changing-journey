import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

const HealingWaves = ({ 
  waveCount = 3, 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  intensity = 'gentle' 
}) => {
  const wave1 = useSharedValue(0)
  const wave2 = useSharedValue(0)
  const wave3 = useSharedValue(0)

  useEffect(() => {
    const getDuration = () => {
      switch (intensity) {
        case 'gentle': return 4000
        case 'moderate': return 3000
        case 'strong': return 2000
        default: return 3500
      }
    }

    const duration = getDuration()

    // Create wave-like motion
    wave1.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    )

    wave2.value = withRepeat(
      withTiming(1, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    )

    wave3.value = withRepeat(
      withTiming(1, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    )
  }, [intensity])

  const wave1Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      wave1.value,
      [0, 1],
      [0, -20]
    )
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(wave1.value, [0, 0.5, 1], [0.3, 0.8, 0.3])
    }
  })

  const wave2Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      wave2.value,
      [0, 1],
      [0, -15]
    )
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(wave2.value, [0, 0.5, 1], [0.2, 0.6, 0.2])
    }
  })

  const wave3Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      wave3.value,
      [0, 1],
      [0, -25]
    )
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(wave3.value, [0, 0.5, 1], [0.4, 0.7, 0.4])
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wave, wave1Style]}>
        <LinearGradient
          colors={[colors[0], 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.wave, wave2Style]}>
        <LinearGradient
          colors={[colors[1], 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.wave, wave3Style]}>
        <LinearGradient
          colors={[colors[2], 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: width * 0.8,
    height: 60,
    borderRadius: 30,
  },
  gradient: {
    flex: 1,
    borderRadius: 30,
  },
})

export default HealingWaves
