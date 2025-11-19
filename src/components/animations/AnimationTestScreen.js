import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import ServiceDetailScreen from '../../screens/services/ServiceDetailScreen'
import { staticData } from '../../utils/staticData'

const AnimationTestScreen = () => {
  // Test with the first service from static data
  const testService = staticData.services[0]
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Animation Test</Text>
        <Text style={styles.headerSubtitle}>
          Testing animated backgrounds in ServiceDetailScreen
        </Text>
      </LinearGradient>
      
      <ServiceDetailScreen 
        route={{ 
          params: { 
            service: testService 
          } 
        }} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
})

export default AnimationTestScreen
