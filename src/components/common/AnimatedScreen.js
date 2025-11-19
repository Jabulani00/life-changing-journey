import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

const AnimatedScreen = ({ children, direction = 'right', duration = 220, style }) => {
  const isFocused = useIsFocused()
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isFocused) {
      // Start slightly off-screen and slide in
      translateX.setValue(direction === 'left' ? -24 : 24)
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    }
  }, [isFocused, direction, duration, translateX])

  return (
    <Animated.View style={[{ flex: 1, transform: [{ translateX }] }, style]}>
      {children}
    </Animated.View>
  )
}

export default AnimatedScreen
