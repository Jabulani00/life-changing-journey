// Premium Donation Screen - Life Changing Journey
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const DonationScreen = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [donationType, setDonationType] = useState('once') // 'once' or 'monthly'

  const donationAmounts = [
    { value: 50, label: 'R50', description: 'Supports 1 person for a week' },
    { value: 100, label: 'R100', description: 'Provides basic wellness resources' },
    { value: 250, label: 'R250', description: 'Funds 1 counseling session' },
    { value: 500, label: 'R500', description: 'Sponsors mental health workshop' },
    { value: 1000, label: 'R1,000', description: 'Supports family wellness program' },
    { value: 0, label: 'Custom', description: 'Choose your own amount' },
  ]

  const impactStories = [
    {
      id: 1,
      name: 'Sarah M.',
      story: 'Thanks to the Nyezi Foundation, I received free counseling sessions that helped me overcome severe depression.',
      category: 'Mental Wellness',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c8?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'David L.',
      story: 'The financial guidance program helped my family get out of debt and plan for our future.',
      category: 'Financial Freedom',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Nomsa K.',
      story: 'Spiritual counseling gave me hope and direction when I felt completely lost.',
      category: 'Spiritual Growth',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const DonationAmountCard = ({ amount, isSelected }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isSelected ? Colors.primary : Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: isSelected ? Colors.primary : Colors.lightGray,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => setSelectedAmount(amount)}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.textStyles.h5,
            color: isSelected ? Colors.white : Colors.textPrimary,
            marginBottom: 4,
          }}>
            {amount.label}
            {donationType === 'monthly' && amount.value > 0 && (
              <Text style={{
                ...Typography.textStyles.caption,
                color: isSelected ? Colors.white : Colors.textSecondary,
              }}> /month</Text>
            )}
          </Text>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: isSelected ? Colors.white : Colors.textSecondary,
            opacity: isSelected ? 0.9 : 1,
          }}>
            {amount.description}
          </Text>
        </View>
        
        {isSelected && (
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name="checkmark" size={16} color={Colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const DonationTypeToggle = () => (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 4,
      flexDirection: 'row',
      marginBottom: 24,
    }}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: donationType === 'once' ? Colors.primary : 'transparent',
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        onPress={() => setDonationType('once')}
        activeOpacity={0.9}
      >
        <Text style={{
          ...Typography.textStyles.bodyBold,
          color: donationType === 'once' ? Colors.white : Colors.textSecondary,
        }}>
          One-time
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: donationType === 'monthly' ? Colors.primary : 'transparent',
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        onPress={() => setDonationType('monthly')}
        activeOpacity={0.9}
      >
        <Text style={{
          ...Typography.textStyles.bodyBold,
          color: donationType === 'monthly' ? Colors.white : Colors.textSecondary,
        }}>
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  )

  const ImpactStoryCard = ({ story }) => (
    <View style={{
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 20,
      marginRight: 16,
      width: 280,
      shadowColor: Colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: Colors.lightGray,
          marginRight: 12,
          overflow: 'hidden',
        }}>
          {/* Placeholder for profile image */}
          <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </View>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.textStyles.h6,
            color: Colors.textPrimary,
            marginBottom: 4,
          }}>
            {story.name}
          </Text>
          <View style={{
            backgroundColor: Colors.primaryAlpha,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            alignSelf: 'flex-start',
          }}>
            <Text style={{
              ...Typography.textStyles.caption,
              color: Colors.primary,
            }}>
              {story.category}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={{
        ...Typography.textStyles.bodySmall,
        color: Colors.textSecondary,
        lineHeight: 20,
      }}>
        "{story.story}"
      </Text>
    </View>
  )

  const handleDonation = () => {
    if (!selectedAmount) {
      Alert.alert('Select Amount', 'Please select a donation amount to continue.')
      return
    }

    Alert.alert(
      'Confirm Donation',
      `Proceed with ${donationType === 'monthly' ? 'monthly' : 'one-time'} donation of ${selectedAmount.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Donate',
          onPress: () => {
            Alert.alert(
              'Thank You!',
              'Your generous donation will make a real difference in someone\'s life. You will be redirected to secure payment.',
              [{ text: 'Continue', onPress: () => navigation.navigate('Payment', { amount: selectedAmount, type: donationType }) }]
            )
          }
        }
      ]
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, Colors.secondaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 50,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              ...Typography.textStyles.h2,
              color: Colors.white,
              marginBottom: 4,
            }}>
              Support Nyezi
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.white,
              opacity: 0.9,
            }}>
              Help us change lives through wellness
            </Text>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 16,
          padding: 16,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="heart" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.white,
            }}>
              OUR MISSION
            </Text>
          </View>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: Colors.white,
            opacity: 0.9,
            lineHeight: 20,
          }}>
            The Nyezi Foundation provides free wellness services to those who cannot afford them, ensuring everyone has access to mental health, spiritual guidance, and life coaching.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Impact Stats */}
        <View style={{
          backgroundColor: Colors.surface,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          shadowColor: Colors.shadow.medium,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}>
          <Text style={{
            ...Typography.textStyles.h5,
            color: Colors.textPrimary,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Your Impact in 2024
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                ...Typography.textStyles.h3,
                color: Colors.primary,
                marginBottom: 4,
              }}>
                247
              </Text>
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                People Helped
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                ...Typography.textStyles.h3,
                color: Colors.secondary,
                marginBottom: 4,
              }}>
                R89K
              </Text>
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                Donations Raised
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                ...Typography.textStyles.h3,
                color: Colors.success,
                marginBottom: 4,
              }}>
                156
              </Text>
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                Donors
              </Text>
            </View>
          </View>
        </View>

        {/* Donation Type Toggle */}
        <DonationTypeToggle />

        {/* Donation Amounts */}
        <Text style={{
          ...Typography.textStyles.h5,
          color: Colors.textPrimary,
          marginBottom: 16,
        }}>
          Choose Your Donation
        </Text>
        
        {donationAmounts.map((amount) => (
          <DonationAmountCard 
            key={amount.value}
            amount={amount}
            isSelected={selectedAmount?.value === amount.value}
          />
        ))}

        {/* Impact Stories */}
        <View style={{ marginTop: 32, marginBottom: 24 }}>
          <Text style={{
            ...Typography.textStyles.h5,
            color: Colors.textPrimary,
            marginBottom: 16,
          }}>
            Stories of Change
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {impactStories.map((story) => (
              <ImpactStoryCard key={story.id} story={story} />
            ))}
          </ScrollView>
        </View>

        {/* Tax Benefits */}
        <View style={{
          backgroundColor: Colors.backgroundSecondary,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: Colors.lightGray,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="document-text" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={{
              ...Typography.textStyles.h6,
              color: Colors.textPrimary,
            }}>
              Tax Deductible Donation
            </Text>
          </View>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: Colors.textSecondary,
            lineHeight: 18,
          }}>
            The Nyezi Foundation is a registered NPO. Your donation is tax deductible under Section 18A of the Income Tax Act. A certificate will be provided.
          </Text>
        </View>

        {/* Contact Info */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: 16,
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
                Questions About Donating?
              </Text>
              <Text style={{
                ...Typography.textStyles.bodySmall,
                color: Colors.textSecondary,
              }}>
                Contact our team for more information about how your donation helps
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

      {/* Bottom Donation Button */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        padding: 16,
        paddingBottom: 32,
      }}>
        <TouchableOpacity
          style={{
            borderRadius: 12,
            opacity: selectedAmount ? 1 : 0.6,
          }}
          onPress={handleDonation}
          disabled={!selectedAmount}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.secondary, Colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="heart" size={20} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={{
                ...Typography.textStyles.button,
                color: Colors.white,
              }}>
                {selectedAmount ? `Donate ${selectedAmount.label}` : 'Select Amount to Donate'}
                {selectedAmount && donationType === 'monthly' && selectedAmount.value > 0 && '/month'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        {selectedAmount && (
          <Text style={{
            ...Typography.textStyles.caption,
            color: Colors.textSecondary,
            textAlign: 'center',
            marginTop: 8,
          }}>
            Secure payment powered by Stripe
          </Text>
        )}
      </View>
    </View>
  )
}

export default DonationScreen
