import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '../../styles/colors'
import ChatbotModal from './ChatbotModal'

const PULSE_SIZE = 80
const STAGGER_MS = 380

// All logo brand colors — each ring pulses in sequence
const RING_COLORS = [
  Colors.secondary,    // #D81F62 pink/magenta
  Colors.accent,       // #E6A623 gold
  Colors.brandTeal,    // #0097A7 teal
  Colors.accentGreen,  // #3A7F3D green
  Colors.brandMaroon,  // #6B1636 maroon
]

const ChatbotFAB = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pulseAnims = useRef(RING_COLORS.map(() => new Animated.Value(0))).current
  const [modalVisible, setModalVisible] = useState(false)

  const getCurrentRouteName = () => {
    try {
      const state = navigation.getState()
      if (!state) return null
      const route = state.routes[state.index]
      if (route.state) {
        const nestedRoute = route.state.routes[route.state.index]
        return nestedRoute?.name || route.name
      }
      return route.name
    } catch (error) {
      return null
    }
  }

  const currentRoute = getCurrentRouteName()

  useEffect(() => {
    if (modalVisible) return

    const timeouts = []
    const loops = []

    pulseAnims.forEach((anim, i) => {
      const t = setTimeout(() => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ])
        )
        loop.start()
        loops.push(loop)
      }, i * STAGGER_MS)
      timeouts.push(t)
    })

    return () => {
      timeouts.forEach(clearTimeout)
      loops.forEach((l) => l.stop())
      pulseAnims.forEach((anim) => anim.setValue(0))
    }
  }, [modalVisible])

  const hideOnRoutes = ['Login', 'Register']
  if (currentRoute && hideOnRoutes.includes(currentRoute)) {
    return null
  }

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 6,
      }),
    ]).start()

    setModalVisible(true)
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            bottom: Math.max(insets.bottom, 16) + 60,
            right: 16,
          },
        ]}
      >
        {/* Multi-color staggered pulse rings — one per brand color */}
        {RING_COLORS.map((color, i) => {
          const scale = pulseAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.65],
          })
          const opacity = pulseAnims[i].interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0.75, 0.4, 0],
          })
          return (
            <Animated.View
              key={color}
              pointerEvents="none"
              style={[
                styles.pulseRing,
                {
                  backgroundColor: color,
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          )
        })}

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <Image
              source={require('../../../assets/chatbot.png')}
              style={styles.fabIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <ChatbotModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    pointerEvents: 'box-none',
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabIcon: {
    width: 56,
    height: 56,
  },
})

export default ChatbotFAB
