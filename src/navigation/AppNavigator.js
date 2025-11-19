// App Navigator - Main navigation component
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { View, ActivityIndicator } from 'react-native'
import { Colors } from '../styles/colors'
import { GlobalStyles } from '../styles/globalStyles'

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={GlobalStyles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default AppNavigator
