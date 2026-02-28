// Admin-only navigator: Dashboard + Manage (Events, Bookings, Live). Shown only when user is admin.
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen'
import AdminScreen from '../screens/main/AdminScreen'

const Stack = createStackNavigator()

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen
        name="AdminManage"
        component={AdminScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AdminNavigator
