// Tab Navigator for main app navigation
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../styles/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SwipeWrapper from '../components/common/SwipeWrapper'
import AnimatedScreen from '../components/common/AnimatedScreen'

// Import screens
import HomeScreen from '../screens/main/HomeScreen'
import ServicesScreen from '../screens/main/ServicesScreen'
import BookingScreen from '../screens/main/BookingScreen'
import ResourcesScreen from '../screens/main/ResourcesScreen'
import DonationScreen from '../screens/main/DonationScreen'

const Tab = createBottomTabNavigator()

const withSwipeAndAnim = (Component, routeLeft, routeRight, animDir) => (props) => (
  <SwipeWrapper
    onSwipeLeft={() => routeLeft && props.navigation.navigate(routeLeft)}
    onSwipeRight={() => routeRight && props.navigation.navigate(routeRight)}
    style={{ flex: 1 }}
  >
    <AnimatedScreen direction={animDir}>
      <Component {...props} />
    </AnimatedScreen>
  </SwipeWrapper>
)

const TabNavigator = () => {
  const insets = useSafeAreaInsets()
  const bottomPad = Math.max(insets.bottom, 8)

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Services':
              iconName = focused ? 'medical' : 'medical-outline'
              break
            case 'Booking':
              iconName = focused ? 'calendar' : 'calendar-outline'
              break
            case 'Connect':
              iconName = focused ? 'people' : 'people-outline'
              break
            case 'Donate':
              iconName = focused ? 'heart' : 'heart-outline'
              break
            default:
              iconName = 'circle'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.lightGray,
          paddingTop: 6,
          paddingBottom: bottomPad,
          height: 56 + bottomPad,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={withSwipeAndAnim(HomeScreen, 'Services', null, 'right')}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Services" 
        component={withSwipeAndAnim(ServicesScreen, 'Connect', 'Home', 'right')}
        options={{ title: 'Services' }}
      />
      {/* Booking tab hidden for directory gateway mode */}
      {false && (
        <Tab.Screen 
          name="Booking" 
          component={BookingScreen}
          options={{ title: 'Booking' }}
        />
      )}
      <Tab.Screen 
        name="Connect" 
        component={withSwipeAndAnim(ResourcesScreen, null, 'Services', 'left')}
        options={{ title: 'Connect' }}
      />
      {/* Donate tab hidden for directory gateway mode */}
      {false && (
        <Tab.Screen 
          name="Donate" 
          component={DonationScreen}
          options={{ title: 'Donate' }}
        />
      )}
    </Tab.Navigator>
  )
}

export default TabNavigator
