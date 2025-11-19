// Premium Testimonial Card Component  
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const TestimonialCard = ({ testimonial, onPress }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={Colors.secondary}
        style={{ marginRight: 2 }}
      />
    ))
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 4,
        marginVertical: 8,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 3,
        borderLeftColor: Colors.secondary,
        width: 300,
      }}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Quote mark */}
      <View style={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.secondaryAlpha,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Ionicons name="chatbubble-ellipses" size={16} color={Colors.secondary} />
      </View>

      {/* Content */}
      <Text style={{
        ...Typography.textStyles.quote,
        color: Colors.textPrimary,
        marginBottom: 16,
        paddingRight: 40,
      }}>
        "{testimonial.content}"
      </Text>

      {/* Rating */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        {renderStars(testimonial.rating)}
      </View>

      {/* Client info */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.primaryAlpha,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          {testimonial.client_image_url ? (
            <Image
              source={{ uri: testimonial.client_image_url }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <Ionicons name="person" size={20} color={Colors.primary} />
          )}
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            fontWeight: Typography.fontWeight.semiBold,
            color: Colors.textPrimary,
          }}>
            {testimonial.client_name}
          </Text>
          {testimonial.service_category && (
            <Text style={{
              ...Typography.textStyles.caption,
              color: Colors.textLight,
            }}>
              {testimonial.service_category.replace('_', ' ')} client
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TestimonialCard
