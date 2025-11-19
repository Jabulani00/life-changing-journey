// Custom Splash Screen - Life Changing Journey
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const { width, height } = Dimensions.get('window')

const CustomSplashScreen = ({ onFinish, minimumMs = 4000 }) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const logoScale = useRef(new Animated.Value(0)).current
  const logoOpacity = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseLoopRef = useRef(null)

  const appName = "Life Changing Journey"
  const letters = appName.split('')

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start letter animation after logo appears
      startLetterAnimation()
    })

    // Subtle pulse animation for logo (controlled)
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 } // Only pulse twice
    )
    pulseLoopRef.current.start()

    return () => {
      // Cleanup animations on unmount
      if (pulseLoopRef.current) {
        pulseLoopRef.current.stop()
      }
    }
  }, [])

  const startLetterAnimation = () => {
    let index = 0
    const interval = setInterval(() => {
      if (index < letters.length) {
        setCurrentLetterIndex(index + 1)
        index++
      } else {
        clearInterval(interval)
        setAnimationComplete(true)
        // Wait a bit after animation completes, then finish
        setTimeout(() => {
          if (typeof onFinish === 'function') {
            onFinish()
          }
        }, 800)
      }
    }, 100) // 100ms delay between each letter

    // Ensure minimum display time
    setTimeout(() => {
      if (index < letters.length) {
        // Speed up remaining letters if needed
        clearInterval(interval)
        setCurrentLetterIndex(letters.length)
        setAnimationComplete(true)
        setTimeout(() => {
          if (typeof onFinish === 'function') {
            onFinish()
          }
        }, 800)
      }
    }, minimumMs - 1500)
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              { scale: Animated.multiply(logoScale, pulseAnim) }
            ],
          },
        ]}
      >
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Animated Text */}
      <View style={styles.textContainer}>
        <Text style={styles.appName}>
          {letters.map((letter, index) => (
            <LetterComponent
              key={index}
              letter={letter}
              index={index}
              visible={index < currentLetterIndex}
            />
          ))}
        </Text>
        
        {/* Tagline appears after name */}
        {currentLetterIndex >= letters.length && (
          <FadeInText text="Transforming Lives, One Journey at a Time" delay={200} />
        )}
      </View>

      {/* Gradient accent at bottom */}
      <View style={styles.bottomAccent}>
        <View style={styles.accentBar} />
      </View>
    </View>
  )
}

// Individual letter component with animation
const LetterComponent = ({ letter, index, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  if (!visible) {
    return <Text style={styles.letter}> </Text>
  }

  return (
    <Animated.Text
      style={[
        styles.letter,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {letter}
    </Animated.Text>
  )
}

// Fade in text component for tagline
const FadeInText = ({ text, delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    }, delay)
  }, [])

  return (
    <Animated.Text
      style={[
        styles.tagline,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {text}
    </Animated.Text>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    marginBottom: 40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appName: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
  },
  letter: {
    fontSize: 28,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  accentBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
})

export default CustomSplashScreen

