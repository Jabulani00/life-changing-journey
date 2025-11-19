// Premium Service Card Component
import React from 'react'
import { TouchableOpacity, Text, View, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const { width } = Dimensions.get('window')

const ServiceCard = ({ 
  service, 
  onPress, 
  variant = 'large', 
  showBookButton = false 
}) => {
  const cardWidth = variant === 'large' ? width - 32 : (width - 48) / 2

  const getServiceTheme = (category) => {
    switch (category) {
      case 'mental_wellness':
        return Colors.mentalWellness
      case 'spiritual_growth':
        return Colors.spiritualGrowth
      case 'financial_guidance':
        return Colors.financialGuidance
      case 'hypnotherapy':
        return Colors.hypnotherapy
      default:
        return Colors.mentalWellness
    }
  }

  const theme = getServiceTheme(service.category)

  return (
    <TouchableOpacity
      style={{
        width: cardWidth,
        marginHorizontal: variant === 'large' ? 0 : 4,
        marginBottom: 16,
      }}
      onPress={() => onPress(service, 'detail')}
      activeOpacity={0.95}
    >
      <View style={{
        backgroundColor: Colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(1, 38, 48, 0.1)',
        elevation: 8,
      }}>
        {/* Header with gradient */}
        <LinearGradient
          colors={[theme.primary, theme.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: variant === 'large' ? 120 : 100,
            padding: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{
              ...Typography.textStyles.h4,
              color: Colors.white,
              marginBottom: 4,
            }}>
              {service.title}
            </Text>
            {variant === 'large' && (
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: Colors.white,
                opacity: 0.9,
              }}>
                {service.shortDescription}
              </Text>
            )}
          </View>
          
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons 
              name={service.icon} 
              size={24} 
              color={Colors.white} 
            />
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ padding: 20 }}>
          {variant === 'large' && (
            <Text style={{
              ...Typography.textStyles.body,
              color: Colors.textSecondary,
              marginBottom: 16,
              lineHeight: 24,
            }}>
              {service.description}
            </Text>
          )}

          {/* Features list */}
          {service.features && variant === 'large' && (
            <View style={{ marginBottom: 20 }}>
              {service.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.primary,
                    marginRight: 12,
                  }} />
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
          )}

          {/* Category badge */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{
              backgroundColor: theme.background,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{
                ...Typography.textStyles.captionBold,
                color: theme.text,
              }}>
                {service.category.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Contact buttons */}
          <View style={{
            flexDirection: 'row',
            gap: 12,
          }}>
            {service.website && (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flex: 1,
                }}
                onPress={() => onPress(service, 'website')}
              >
                <Ionicons 
                  name="paper-plane-outline" 
                  size={16} 
                  color={Colors.white} 
                  style={{ marginRight: 6 }}
                />
                <Text style={{
                  ...Typography.textStyles.button,
                  color: Colors.white,
                  fontSize: 14,
                }}>
                  Visit
                </Text>
              </TouchableOpacity>
            )}
            
            {service.phone && (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.success,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flex: 1,
                }}
                onPress={() => onPress(service, 'call')}
              >
                <Ionicons 
                  name="call-outline" 
                  size={16} 
                  color={Colors.white} 
                  style={{ marginRight: 6 }}
                />
                <Text style={{
                  ...Typography.textStyles.button,
                  color: Colors.white,
                  fontSize: 14,
                }}>
                  Call
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ServiceCard
