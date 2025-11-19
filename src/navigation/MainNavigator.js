// Main Navigator for authenticated users
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from './TabNavigator'
import ProfileScreen from '../screens/auth/ProfileScreen'
import ContactScreen from '../screens/main/ContactScreen'
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen'
import MentalWellnessScreen from '../screens/services/MentalWellnessScreen'
import SpiritualGrowthScreen from '../screens/services/SpiritualGrowthScreen'
import FinancialGuidanceScreen from '../screens/services/FinancialGuidanceScreen'
import HypnotherapyScreen from '../screens/services/HypnotherapyScreen'
import IntegratedServicesScreen from '../screens/services/IntegratedServicesScreen'

const Stack = createStackNavigator()

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
        }}
      />
      <Stack.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{
          headerShown: true,
          title: 'Contact Us',
        }}
      />
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{
          headerShown: true,
          title: 'Service Details',
        }}
      />
      <Stack.Screen 
        name="MentalWellness" 
        component={MentalWellnessScreen}
        options={{
          headerShown: true,
          title: 'Mental Wellness',
        }}
      />
      <Stack.Screen 
        name="SpiritualGrowth" 
        component={SpiritualGrowthScreen}
        options={{
          headerShown: true,
          title: 'Spiritual Growth',
        }}
      />
      <Stack.Screen 
        name="FinancialGuidance" 
        component={FinancialGuidanceScreen}
        options={{
          headerShown: true,
          title: 'Financial Guidance',
        }}
      />
      <Stack.Screen 
        name="Hypnotherapy" 
        component={HypnotherapyScreen}
        options={{
          headerShown: true,
          title: 'Hypnotherapy',
        }}
      />
      <Stack.Screen 
        name="IntegratedServices" 
        component={IntegratedServicesScreen}
        options={{
          headerShown: true,
          title: 'Integrated Services',
        }}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator
