import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { staticData } from '../../utils/staticData'

const ServiceDebugTest = () => {
  const services = staticData.services

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Service Debug Test</Text>
        <Text style={styles.headerSubtitle}>
          Checking service data structure
        </Text>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {services.map((service, index) => (
          <View key={service.id} style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>
              {index + 1}. {service.title}
            </Text>
            <Text style={styles.serviceCategory}>
              Category: {service.category || 'UNDEFINED'}
            </Text>
            <Text style={styles.serviceId}>
              ID: {service.id}
            </Text>
            <Text style={styles.servicePractitioner}>
              Practitioner: {service.practitioner}
            </Text>
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  serviceId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  servicePractitioner: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 5,
  },
})

export default ServiceDebugTest
