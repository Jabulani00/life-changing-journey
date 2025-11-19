// Premium Resource Card Component
import React from 'react'
import { TouchableOpacity, Text, View, Image, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const { width } = Dimensions.get('window')

const ResourceCard = ({ 
  resource, 
  onPress, 
  variant = 'default',
  showCategory = true 
}) => {
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return 'play-circle'
      case 'audio':
        return 'musical-notes'
      case 'article':
        return 'document-text'
      case 'pdf':
        return 'download'
      default:
        return 'document'
    }
  }

  const getResourceColor = (category) => {
    switch (category) {
      case 'mental_wellness':
        return Colors.mentalWellness.primary
      case 'spiritual_growth':
        return Colors.spiritualGrowth.primary
      case 'financial_guidance':
        return Colors.financialGuidance.primary
      case 'hypnotherapy':
        return Colors.hypnotherapy.primary
      default:
        return Colors.primary
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return null
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const cardWidth = variant === 'featured' ? width - 32 : (width - 48) / 2

  return (
    <TouchableOpacity
      style={{
        width: cardWidth,
        marginHorizontal: variant === 'featured' ? 0 : 4,
        marginBottom: 16,
      }}
      onPress={() => onPress(resource)}
      activeOpacity={0.95}
    >
      <View style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}>
        {/* Thumbnail/Header */}
        <View style={{
          height: variant === 'featured' ? 160 : 120,
          position: 'relative',
        }}>
          {resource.thumbnail_url ? (
            <Image
              source={{ uri: resource.thumbnail_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[getResourceColor(resource.category), Colors.lightGray]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%' }}
            />
          )}

          {/* Overlay with play button for videos */}
          {resource.resource_type === 'video' && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons 
                  name="play" 
                  size={24} 
                  color={getResourceColor(resource.category)} 
                />
              </View>
            </View>
          )}

          {/* Type indicator */}
          <View style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name={getResourceIcon(resource.resource_type)} 
              size={12} 
              color={Colors.white} 
            />
            {resource.duration && (
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.white,
                marginLeft: 4,
              }}>
                {formatDuration(resource.duration)}
              </Text>
            )}
          </View>

          {/* Featured badge */}
          {resource.is_featured && (
            <View style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: Colors.secondary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.white,
                fontWeight: Typography.fontWeight.semiBold,
              }}>
                Featured
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          <Text style={{
            ...Typography.textStyles.h6,
            color: Colors.textPrimary,
            marginBottom: 8,
            lineHeight: 22,
          }} numberOfLines={2}>
            {resource.title}
          </Text>

          {variant === 'featured' && resource.content && (
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
              marginBottom: 12,
              lineHeight: 20,
            }} numberOfLines={3}>
              {resource.content}
            </Text>
          )}

          {/* Category and date */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {showCategory && (
              <View style={{
                backgroundColor: getResourceColor(resource.category) + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Text style={{
                  ...Typography.textStyles.caption,
                  color: getResourceColor(resource.category),
                  fontWeight: Typography.fontWeight.medium,
                }}>
                  {resource.category.replace('_', ' ')}
                </Text>
              </View>
            )}

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="time-outline" 
                size={12} 
                color={Colors.textLight} 
              />
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.textLight,
                marginLeft: 4,
              }}>
                {new Date(resource.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ResourceCard
