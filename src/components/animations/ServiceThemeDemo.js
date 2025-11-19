import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import ServiceDetailScreen from '../../screens/services/ServiceDetailScreen'
import { staticData } from '../../utils/staticData'

const ServiceThemeDemo = () => {
  const [selectedService, setSelectedService] = React.useState(0)
  
  const services = staticData.services

  const getServiceTheme = (service) => {
    switch (service.category) {
      case 'mental_wellness':
        return { name: 'Psychology', color: '#667eea', effect: 'Healing Waves' }
      case 'spiritual_growth':
        return { name: 'Spiritual', color: '#f093fb', effect: 'Floating Particles' }
      case 'financial_guidance':
        return { name: 'Financial', color: '#4facfe', effect: 'Healing Waves' }
      case 'hypnotherapy':
        return { name: 'Hypnotherapy', color: '#667eea', effect: 'Floating Particles' }
      case 'consulting':
        return { name: 'Consulting', color: '#4facfe', effect: 'Healing Waves' }
      case 'education':
        return { name: 'Education', color: '#f093fb', effect: 'Floating Particles' }
      default:
        return { name: 'General', color: '#667eea', effect: 'Healing Waves' }
    }
  }

  return (
    <View style={styles.container}>
      {/* Service Selector */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Service Theme Demo</Text>
        <Text style={styles.headerSubtitle}>
          Each service has unique animations and colors
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.serviceSelector}
        >
          {services.map((service, index) => {
            const theme = getServiceTheme(service)
            return (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceButton,
                  { backgroundColor: theme.color },
                  selectedService === index && styles.selectedService
                ]}
                onPress={() => setSelectedService(index)}
              >
                <Text style={styles.serviceButtonText}>
                  {theme.name}
                </Text>
                <Text style={styles.serviceButtonSubtext}>
                  {theme.effect}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </LinearGradient>

      {/* Service Detail Screen */}
      <ServiceDetailScreen 
        route={{ 
          params: { 
            service: services[selectedService] 
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  serviceSelector: {
    marginTop: 10,
  },
  serviceButton: {
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedService: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  serviceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  serviceButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
  },
})

export default ServiceThemeDemo
