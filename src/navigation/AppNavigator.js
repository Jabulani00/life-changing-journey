// App Navigator - Main navigation component. Branches on auth and role: admin → AdminNavigator, user → MainNavigator.
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import ChatbotFAB from '../components/common/ChatbotFAB'
import { useAuth } from '../context/AuthContext'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { Colors } from '../styles/colors'
import { GlobalStyles } from '../styles/globalStyles'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { navigationRef } from './navigationRef'

const AppNavigator = () => {
  const { user, loading, admin, adminLoading } = useAuth()
  usePushNotifications(true)

  const resolvingRole = user && adminLoading

  if (loading || resolvingRole) {
    return (
      <View style={GlobalStyles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? (
        <>
          <MainNavigator />
          <ChatbotFAB />
        </>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  )
}

export default AppNavigator
