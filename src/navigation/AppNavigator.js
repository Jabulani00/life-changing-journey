// App Navigator - Main navigation component. Branches on auth and role: admin → AdminNavigator, user → MainNavigator.
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import AdminNavigator from './AdminNavigator'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { View, ActivityIndicator } from 'react-native'
import { Colors } from '../styles/colors'
import { GlobalStyles } from '../styles/globalStyles'

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
      {!user ? (
        <AuthNavigator />
      ) : admin ? (
        <AdminNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  )
}

export default AppNavigator
