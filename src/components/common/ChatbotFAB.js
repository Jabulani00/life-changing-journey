// Floating Action Button for Chatbot - Available throughout the app
// Icon size: 24px is optimal for a 56x56px FAB button (standard range: 24-28px)
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '../../styles/colors'
import ChatbotModal from './ChatbotModal'

const ChatbotFAB = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [modalVisible, setModalVisible] = useState(false)

  // Get current route name using navigation.getState()
  const getCurrentRouteName = () => {
    try {
      const state = navigation.getState()
      if (!state) return null
      const route = state.routes[state.index]
      // If we're in a nested navigator, get the active route
      if (route.state) {
        const nestedRoute = route.state.routes[route.state.index]
        return nestedRoute?.name || route.name
      }
      return route.name
    } catch (error) {
      // If navigation state is not available, return null
      return null
    }
  }

  const currentRoute = getCurrentRouteName()

  // Hide FAB when on Auth screens
  const hideOnRoutes = ['Login', 'Register']
  if (currentRoute && hideOnRoutes.includes(currentRoute)) {
    return null
  }

  const handlePress = () => {
    // Pulse animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
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
            bottom: Math.max(insets.bottom, 16) + 60, // Above tab bar
            right: 16,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            {/* Custom chatbot icon - 24px size for 56x56px FAB */}
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
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow.strong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
})

export default ChatbotFAB
