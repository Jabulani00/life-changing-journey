// App Navigator - Main navigation component. Branches on auth and role: admin → AdminNavigator, user → MainNavigator.
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import ChatbotFAB from '../components/common/ChatbotFAB'
import { useAuth } from '../context/AuthContext'
import { Colors } from '../styles/colors'
import { GlobalStyles } from '../styles/globalStyles'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'

const AppNavigator = () => {
  const { user, loading, admin, adminLoading } = useAuth()

  const resolvingRole = user && adminLoading

  if (loading || resolvingRole) {
    return (
      <View style={GlobalStyles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
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
