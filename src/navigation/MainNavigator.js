// Main Navigator for authenticated users
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import ProfileScreen from '../screens/auth/ProfileScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import ContactScreen from '../screens/main/ContactScreen'
import EventsScreen from '../screens/main/EventsScreen'
import LiveScreen from '../screens/main/LiveScreen'
import MyBookingsScreen from '../screens/main/MyBookingsScreen'
import FinancialGuidanceScreen from '../screens/services/FinancialGuidanceScreen'
import HypnotherapyScreen from '../screens/services/HypnotherapyScreen'
import IntegratedServicesScreen from '../screens/services/IntegratedServicesScreen'
import MentalWellnessScreen from '../screens/services/MentalWellnessScreen'
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen'
import SpiritualGrowthScreen from '../screens/services/SpiritualGrowthScreen'
import AdminScreen from '../screens/main/AdminScreen'
import ChatbotScreen from '../screens/main/ChatbotScreen'
import MotivationsScreen from '../screens/main/MotivationsScreen'
import MembershipPackagesScreen from '../components/membership/MembershipPackagesScreen'
import { Colors } from '../styles/colors'
import TabNavigator from './TabNavigator'

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
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen 
        name="Events" 
        component={EventsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Live" 
        component={LiveScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MyBookings" 
        component={MyBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Admin" 
        component={AdminScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Motivations" 
        component={MotivationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MembershipPackages"
        component={MembershipPackagesScreen}
        options={{
          headerShown: true,
          title: 'Membership',
          headerTintColor: Colors.primary,
          headerStyle: { backgroundColor: Colors.surface },
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator
