// Premium Services Screen - Life Changing Journey
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, FlatList, Linking, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import ServiceCard from '../../components/cards/ServiceCard'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'

const ServicesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', title: 'All Services', icon: 'grid-outline' },
    { id: 'mental_wellness', title: 'Mental Wellness', icon: 'fitness-outline' },
    { id: 'spiritual_growth', title: 'Spiritual Growth', icon: 'leaf-outline' },
    { id: 'financial_guidance', title: 'Financial', icon: 'trending-up-outline' },
    { id: 'hypnotherapy', title: 'Hypnotherapy', icon: 'moon-outline' },
  ]

  const filteredServices = selectedCategory === 'all' 
    ? staticData.services 
    : staticData.services.filter(service => service.category === selectedCategory)

  const CategoryButton = ({ category, isSelected }) => (
    <TouchableOpacity
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: isSelected ? Colors.primary : Colors.surface,
        marginRight: 8,
        boxShadow: '0 2px 4px rgba(1, 38, 48, 0.05)',
        elevation: 2,
        borderWidth: 1,
        borderColor: isSelected ? Colors.primary : Colors.lightGray,
      }}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons 
          name={category.icon} 
          size={16} 
          color={isSelected ? Colors.white : Colors.textSecondary} 
          style={{ marginRight: 6 }}
        />
        <Text style={{
          ...Typography.textStyles.captionBold,
          color: isSelected ? Colors.white : Colors.textSecondary,
        }}>
          {category.title}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const ServiceDetailModal = ({ service }) => (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 20,
      margin: 16,
      padding: 20,
      boxShadow: '0 8px 16px rgba(1, 38, 48, 0.15)',
      elevation: 10,
    }}>
      {/* Practitioner Info */}
      <View style={{
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}>
        <Text style={{
          ...Typography.textStyles.captionBold,
          color: Colors.primary,
          marginBottom: 4,
        }}>
          YOUR PRACTITIONER
        </Text>
        <Text style={{
          ...Typography.textStyles.h6,
          color: Colors.textPrimary,
          marginBottom: 2,
        }}>
          {service.practitioner}
        </Text>
        <Text style={{
          ...Typography.textStyles.caption,
          color: Colors.textSecondary,
        }}>
          {service.practitionerTitle}
        </Text>
      </View>

      {/* What's Included */}
      <Text style={{
        ...Typography.textStyles.h6,
        color: Colors.textPrimary,
        marginBottom: 12,
      }}>
        What's Included
      </Text>

      {service.features && service.features.map((feature, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <View style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.success + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Ionicons name="checkmark" size={12} color={Colors.success} />
          </View>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: Colors.textSecondary,
            flex: 1,
          }}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 50,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{
          ...Typography.textStyles.h2,
          color: Colors.white,
          marginBottom: 8,
        }}>
          Our Services
        </Text>
        <Text style={{
          ...Typography.textStyles.bodySmall,
          color: Colors.white,
          opacity: 0.9,
        }}>
          Comprehensive wellness programs designed for your transformation
        </Text>
      </LinearGradient>

      {/* Category Filter */}
      <View style={{ paddingVertical: 16 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <CategoryButton 
              category={item} 
              isSelected={selectedCategory === item.id}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Services List */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="always"
      >
        {filteredServices.map((service) => (
          <View key={service.id} style={{ marginBottom: 16 }}>
            <ServiceCard 
              service={service}
              variant="large"
              onPress={(service, action) => {
                if (action === 'website' && service.website) {
                  // Open website in browser
                  Linking.openURL(service.website).catch(() => {
                    Alert.alert('Error', 'Unable to open website. Please check your internet connection.')
                  })
                } else if (action === 'call' && service.phone) {
                  // Open phone dialer
                  Linking.openURL(`tel:${service.phone}`).catch(() => {
                    Alert.alert('Error', 'Unable to make call. Please check your device settings.')
                  })
                } else if (action === 'detail') {
                  // Navigate to service detail screen
                  navigation.navigate('ServiceDetail', { service })
                } else {
                  // Default: Navigate to service detail screen
                  navigation.navigate('ServiceDetail', { service })
                }
              }}
            />
            
            {/* Additional Details */}
            <ServiceDetailModal service={service} />
          </View>
        ))}

        {/* Call to Action */}
        <View style={{
          backgroundColor: Colors.surface,
          borderRadius: 20,
          overflow: 'hidden',
          marginTop: 24,
          boxShadow: '0 4px 12px rgba(1, 38, 48, 0.1)',
          elevation: 5,
        }}>
          <LinearGradient
            colors={[Colors.secondary, Colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24, alignItems: 'center' }}
          >
            <Ionicons name="calendar" size={40} color={Colors.white} style={{ marginBottom: 12 }} />
            <Text style={{
              ...Typography.textStyles.h5,
              color: Colors.white,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Ready to Begin Your Journey?
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.white,
              opacity: 0.9,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Book a consultation and take the first step towards transformation
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.white,
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 24,
              }}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={{
                ...Typography.textStyles.button,
                color: Colors.secondary,
              }}>
                Book Consultation
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Contact Section */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: 20,
            marginTop: 16,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
          onPress={() => navigation.navigate('Contact')}
          activeOpacity={0.95}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.textStyles.h6,
                color: Colors.textPrimary,
                marginBottom: 4,
              }}>
                Have Questions?
              </Text>
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: Colors.textSecondary,
              }}>
                Get in touch with our team for personalized guidance
              </Text>
            </View>
            
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: Colors.primaryAlpha,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default ServicesScreen
