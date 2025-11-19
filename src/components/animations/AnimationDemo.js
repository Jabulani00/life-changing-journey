import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import ServiceAnimationSystem from './ServiceAnimationSystem'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const AnimationDemo = () => {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    { type: 'psychology', title: 'Psychology Services', description: 'Mental wellness & therapy' },
    { type: 'spiritual', title: 'Spiritual Interventions', description: 'Traditional healing & guidance' },
    { type: 'financial', title: 'Financial Services', description: 'Loans & financial solutions' },
    { type: 'hypnotherapy', title: 'Hypnotherapy', description: 'Life coaching & transformation' },
    { type: 'consulting', title: 'Integrated Services', description: 'Professional registrations' },
    { type: 'education', title: 'Foundation', description: 'Educational support & development' }
  ]

  const handleServicePress = (serviceType) => {
    setSelectedService(serviceType)
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Service Animations</Text>
        <Text style={styles.subtitle}>
          Interactive animations representing each service
        </Text>

        <View style={styles.grid}>
          {services.map((service, index) => (
            <ServiceAnimationSystem
              key={service.type}
              serviceType={service.type}
              showBackground={true}
              intensity="gentle"
              onPress={handleServicePress}
            />
          ))}
        </View>

        {selectedService && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedTitle}>
              {services.find(s => s.type === selectedService)?.title}
            </Text>
            <Text style={styles.selectedDescription}>
              {services.find(s => s.type === selectedService)?.description}
            </Text>
          </View>
        )}

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Animation Types:</Text>
          <Text style={styles.legendItem}>• Gentle Pulse - Calming, steady rhythm</Text>
          <Text style={styles.legendItem}>• Mystical Float - Ethereal, spiritual movement</Text>
          <Text style={styles.legendItem}>• Stable Growth - Steady, reliable motion</Text>
          <Text style={styles.legendItem}>• Hypnotic Spiral - Focused, transformative</Text>
          <Text style={styles.legendItem}>• Knowledge Flow - Educational, flowing</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.textStyles.h2,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    ...Typography.textStyles.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  selectedInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  selectedTitle: {
    ...Typography.textStyles.h3,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectedDescription: {
    ...Typography.textStyles.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  legend: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  legendTitle: {
    ...Typography.textStyles.h4,
    color: '#fff',
    marginBottom: 10,
  },
  legendItem: {
    ...Typography.textStyles.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
})

export default AnimationDemo
