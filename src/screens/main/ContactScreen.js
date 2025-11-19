// Professional Contact Screen - Life Changing Journey
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import CustomButton from '../../components/common/CustomButton'
import CustomInput from '../../components/common/CustomInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const ContactScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceInterest: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const serviceOptions = [
    'Psychology Services',
    'Spiritual Interventions', 
    'Financial Guidance',
    'Hypnotherapy & Life Coaching',
    'Integrated Services',
    'Educational Support',
    'General Inquiry'
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        Alert.alert(
          'Message Sent!',
          'Thank you for contacting us. We will get back to you within 24 hours.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  message: '',
                  serviceInterest: ''
                })
                setErrors({})
              }
            }
          ]
        )
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      Alert.alert(
        'Error',
        'Failed to send message. Please try again or contact us directly.',
        [
          { text: 'Try Again' },
          { 
            text: 'Call Us', 
            onPress: () => Linking.openURL('tel:+27310350208')
          }
        ]
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCall = () => {
    Linking.openURL('tel:+27310350208')
  }

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/27658460441')
  }

  const handleEmail = () => {
    Linking.openURL('mailto:info@lifechangingjourney.co.za')
  }

  if (loading) {
    return <LoadingSpinner variant="gradient" text="Sending your message..." />
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          textAlign: 'center',
        }}>
          Contact Us
        </Text>
        <Text style={{
          ...Typography.textStyles.bodySmall,
          color: Colors.white,
          opacity: 0.9,
          textAlign: 'center',
        }}>
          We're here to help with your wellness journey
        </Text>
      </LinearGradient>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Contact Options */}
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
            Get In Touch
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                padding: 16,
                backgroundColor: Colors.primary + '10',
                borderRadius: 16,
                minWidth: 80,
              }}
              onPress={handleCall}
            >
              <Ionicons name="call" size={24} color={Colors.primary} />
              <Text style={{
                ...Typography.textStyles.captionBold,
                color: Colors.primary,
                marginTop: 8,
                textAlign: 'center',
              }}>
                Call
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#25D366' + '10',
                borderRadius: 16,
                minWidth: 80,
              }}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={{
                ...Typography.textStyles.captionBold,
                color: '#25D366',
                marginTop: 8,
                textAlign: 'center',
              }}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                alignItems: 'center',
                padding: 16,
                backgroundColor: Colors.secondary + '10',
                borderRadius: 16,
                minWidth: 80,
              }}
              onPress={handleEmail}
            >
              <Ionicons name="mail" size={24} color={Colors.secondary} />
              <Text style={{
                ...Typography.textStyles.captionBold,
                color: Colors.secondary,
                marginTop: 8,
                textAlign: 'center',
              }}>
                Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Form */}
        <View style={{
          backgroundColor: Colors.surface,
          borderRadius: 20,
          padding: 20,
          shadowColor: Colors.shadow.medium,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}>
          <Text style={{
            ...Typography.textStyles.h5,
            color: Colors.textPrimary,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            Send us a Message
          </Text>

          <CustomInput
            label="Full Name *"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => setFormData({...formData, name: value})}
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
          />

          <CustomInput
            label="Email Address *"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => setFormData({...formData, email: value})}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => setFormData({...formData, phone: value})}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textSecondary} />}
          />

          <CustomInput
            label="Subject *"
            placeholder="What is this about?"
            value={formData.subject}
            onChangeText={(value) => setFormData({...formData, subject: value})}
            error={errors.subject}
            leftIcon={<Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />}
          />

          {/* Service Interest Dropdown */}
          <View style={{ marginVertical: 8 }}>
            <Text style={{
              fontSize: Typography.fontSize.sm,
              fontWeight: Typography.fontWeight.medium,
              color: Colors.textPrimary,
              marginBottom: 4,
            }}>
              Service Interest
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              {serviceOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    backgroundColor: formData.serviceInterest === option ? Colors.primary : Colors.backgroundSecondary,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: formData.serviceInterest === option ? Colors.primary : Colors.lightGray,
                  }}
                  onPress={() => setFormData({...formData, serviceInterest: option})}
                >
                  <Text style={{
                    fontSize: Typography.fontSize.sm,
                    color: formData.serviceInterest === option ? Colors.white : Colors.textSecondary,
                    fontWeight: formData.serviceInterest === option ? Typography.fontWeight.semiBold : 'normal',
                  }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <CustomInput
            label="Message *"
            placeholder="Tell us how we can help you..."
            value={formData.message}
            onChangeText={(value) => setFormData({...formData, message: value})}
            multiline
            numberOfLines={4}
            error={errors.message}
            style={{ marginBottom: 20 }}
          />

          <CustomButton
            title="Send Message"
            onPress={handleSubmit}
            loading={loading}
            icon={<Ionicons name="send" size={16} color={Colors.white} />}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Contact Information */}
        <View style={{
          backgroundColor: Colors.backgroundSecondary,
          borderRadius: 16,
          padding: 16,
          marginTop: 16,
          borderWidth: 1,
          borderColor: Colors.lightGray,
        }}>
          <Text style={{
            ...Typography.textStyles.h6,
            color: Colors.textPrimary,
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Contact Information
          </Text>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.primary,
              marginBottom: 2,
            }}>
              Main Office
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
            }}>
              Durban, South Africa
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.primary,
              marginBottom: 2,
            }}>
              Phone
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
            }}>
              +27 31 035 0208
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.primary,
              marginBottom: 2,
            }}>
              Email
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
            }}>
              info@lifechangingjourney.co.za
            </Text>
          </View>
          
          <View>
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.primary,
              marginBottom: 2,
            }}>
              Response Time
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textSecondary,
            }}>
              We respond within 24 hours
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ContactScreen
