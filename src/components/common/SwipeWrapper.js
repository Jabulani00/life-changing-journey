import React, { useRef } from 'react'
import { PanResponder, View } from 'react-native'

const SWIPE_THRESHOLD = 60
const SWIPE_VELOCITY = 0.2

const SwipeWrapper = ({ onSwipeLeft, onSwipeRight, children, style }) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy, vx } = gestureState
        // Horizontal intent with reasonable velocity
        return (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) || Math.abs(vx) > SWIPE_VELOCITY
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        if (dx <= -SWIPE_THRESHOLD || vx <= -SWIPE_VELOCITY) {
          onSwipeLeft && onSwipeLeft()
        } else if (dx >= SWIPE_THRESHOLD || vx >= SWIPE_VELOCITY) {
          onSwipeRight && onSwipeRight()
        }
      },
    })
  ).current

  return (
    <View style={style} {...panResponder.panHandlers}>
      {children}
    </View>
  )
}

export default SwipeWrapper
