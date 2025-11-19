// Service Detail Screen - Directory Gateway with Simple Theme Colors
import React from 'react'
import { View, Text, ScrollView, Linking, Alert, Image, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlobalStyles } from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import CustomButton from '../../components/common/CustomButton'

const { width, height } = Dimensions.get('window')

const ServiceDetailScreen = ({ route }) => {
  const { service } = route.params


  // Function to get the correct image for each service
  const getServiceImage = (service) => {
    if (!service || !service.id) return null
    
    const imageMap = {
      1: require('../../../assets/images/vuyani-nyezi-psychology.jpeg'),
      2: require('../../../assets/images/life-changing-journey-spiritual.jpeg'),
      3: require('../../../assets/images/tshabalala-omkhulu-financial.jpeg'),
      4: require('../../../assets/images/life-changing-journey-hypnotherapy.jpeg'),
      5: require('../../../assets/images/life-changing-journey-integrated.jpeg'),
      6: require('../../../assets/images/nyezi-vuyani-foundation.jpeg')
    }
    
    return imageMap[service.id] || null
  }

  const handleWebsitePress = (url) =>
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website. Please check your internet connection.')
    })

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make call. Please check your device settings.')
    })
  }

  // Get service-specific theme colors
  const getServiceTheme = () => {
    if (!service) {
      return {
        primaryColor: Colors.primary,
        secondaryColor: Colors.secondary,
        backgroundColor: Colors.background,
        cardColor: Colors.surface
      }
    }
    
    let category = service.category
    
    // Fallback: determine category from service title
    if (!category) {
      if (service.title?.toLowerCase().includes('psychology') || service.title?.toLowerCase().includes('mental')) {
        category = 'mental_wellness'
      } else if (service.title?.toLowerCase().includes('spiritual') || service.title?.toLowerCase().includes('traditional')) {
        category = 'spiritual_growth'
      } else if (service.title?.toLowerCase().includes('financial') || service.title?.toLowerCase().includes('tshabalala')) {
        category = 'financial_guidance'
      } else if (service.title?.toLowerCase().includes('hypnotherapy') || service.title?.toLowerCase().includes('hypnosis')) {
        category = 'hypnotherapy'
      } else if (service.title?.toLowerCase().includes('consulting') || service.title?.toLowerCase().includes('omkhulu')) {
        category = 'consulting'
      } else if (service.title?.toLowerCase().includes('foundation') || service.title?.toLowerCase().includes('education')) {
        category = 'education'
      } else {
        category = 'general'
      }
    }
    
    // Return simple theme colors based on category
    switch (category) {
      case 'mental_wellness':
        return {
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          backgroundColor: '#f8f9ff',
          cardColor: '#ffffff'
        }
      case 'spiritual_growth':
        return {
          primaryColor: '#f093fb',
          secondaryColor: '#f5576c',
          backgroundColor: '#fef7ff',
          cardColor: '#ffffff'
        }
      case 'financial_guidance':
        return {
          primaryColor: '#4facfe',
          secondaryColor: '#00f2fe',
          backgroundColor: '#f0f9ff',
          cardColor: '#ffffff'
        }
      case 'hypnotherapy':
        return {
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          backgroundColor: '#f8f9ff',
          cardColor: '#ffffff'
        }
      case 'consulting':
        return {
          primaryColor: '#4facfe',
          secondaryColor: '#00f2fe',
          backgroundColor: '#f0f9ff',
          cardColor: '#ffffff'
        }
      case 'education':
        return {
          primaryColor: '#f093fb',
          secondaryColor: '#f5576c',
          backgroundColor: '#fef7ff',
          cardColor: '#ffffff'
        }
      default:
        return {
          primaryColor: Colors.primary,
          secondaryColor: Colors.secondary,
          backgroundColor: Colors.background,
          cardColor: Colors.surface
        }
    }
  }

  const theme = getServiceTheme()

  // Get comprehensive business information for each service
  const getBusinessInfo = (service) => {
    if (!service || !service.id) {
      return null
    }
    
    switch (service.id) {
      case 1: // Psychology Services
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Practice Name:</Text>
              <Text style={styles.infoValue}>Vuyani Nyezi Psychology Practice</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Years of Experience:</Text>
              <Text style={styles.infoValue}>12+ years in counselling psychology</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Specialization:</Text>
              <Text style={styles.infoValue}>African Psychology & Indigenous Knowledge Systems</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Languages:</Text>
              <Text style={styles.infoValue}>English, isiZulu, isiXhosa</Text>
            </View>
          </View>
        )
      
      case 2: // Spiritual Interventions
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Organization:</Text>
              <Text style={styles.infoValue}>Life Changing Journey</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Traditional Practice:</Text>
              <Text style={styles.infoValue}>African Traditional Healing</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cultural Focus:</Text>
              <Text style={styles.infoValue}>Ubuntu Philosophy & Ancestral Wisdom</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Approach:</Text>
              <Text style={styles.infoValue}>Holistic spiritual healing practices</Text>
            </View>
          </View>
        )
      
      case 3: // Tshabalala Financial
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Company:</Text>
              <Text style={styles.infoValue}>Tshabalala Omhle Financial Group</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Registration:</Text>
              <Text style={styles.infoValue}>NCR Registered (NCRCP20083)</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ownership:</Text>
              <Text style={styles.infoValue}>100% Black-owned enterprise</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>Durban, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Focus:</Text>
              <Text style={styles.infoValue}>Community-focused financial solutions</Text>
            </View>
          </View>
        )
      
      case 4: // Hypnotherapy
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Practice:</Text>
              <Text style={styles.infoValue}>Life Changing Journey Hypnotherapy</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Approach:</Text>
              <Text style={styles.infoValue}>Clinical Hypnotherapy & Life Coaching</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Focus:</Text>
              <Text style={styles.infoValue}>Personal transformation & habit change</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Methodology:</Text>
              <Text style={styles.infoValue}>Evidence-based hypnotherapy techniques</Text>
            </View>
          </View>
        )
      
      case 5: // Tshabalala Omkhulu Consulting
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Company:</Text>
              <Text style={styles.infoValue}>Tshabalala Omkhulu Consulting</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Services:</Text>
              <Text style={styles.infoValue}>Professional registrations & business consulting</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Specialization:</Text>
              <Text style={styles.infoValue}>One-stop professional services</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Coverage:</Text>
              <Text style={styles.infoValue}>Nationwide service delivery</Text>
            </View>
          </View>
        )
      
      case 6: // Nyezi Foundation
        return (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Foundation:</Text>
              <Text style={styles.infoValue}>Nyezi Vuyani Foundation</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>Non-profit organization (NPO)</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mission:</Text>
              <Text style={styles.infoValue}>Educational support for rural communities</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Focus Areas:</Text>
              <Text style={styles.infoValue}>Rural education & youth empowerment</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Impact:</Text>
              <Text style={styles.infoValue}>Bridging urban-rural educational gaps</Text>
            </View>
          </View>
        )
      
      default:
        return null
    }
  }

  // Get credentials and certifications
  const getCredentials = (service) => {
    if (!service || !service.id) {
      return null
    }
    
    switch (service.id) {
      case 1: // Psychology Services
        return (
          <View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Registered Counselling Psychologist</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>12+ years clinical experience</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>African Psychology specialization</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Indigenous Knowledge Systems</Text>
            </View>
          </View>
        )
      
      case 3: // Tshabalala Financial
        return (
          <View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>NCR Registered (NCRCP20083)</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Licensed Credit Provider</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Black-owned enterprise</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Community-focused lending</Text>
            </View>
          </View>
        )
      
      case 5: // Tshabalala Omkhulu Consulting
        return (
          <View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Professional Services Provider</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Government Registration Specialist</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Business Consulting Services</Text>
            </View>
            <View style={styles.credentialItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primaryColor} />
              <Text style={styles.credentialText}>Traditional Wisdom Integration</Text>
            </View>
          </View>
        )
      
      default:
        return null
    }
  }

  // Get location and hours information
  const getLocationInfo = (service) => {
    if (!service || !service.id) {
      return null
    }
    
    switch (service.id) {
      case 1: // Psychology Services
        return (
          <View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Durban, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Mon-Fri: 8:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Sat: 9:00 AM - 2:00 PM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="videocam" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Online sessions available</Text>
            </View>
          </View>
        )
      
      case 3: // Tshabalala Financial
        return (
          <View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Durban, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Mon-Fri: 8:00 AM - 5:00 PM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Emergency loans available</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="globe" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Online applications accepted</Text>
            </View>
          </View>
        )
      
      case 5: // Tshabalala Omkhulu Consulting
        return (
          <View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Durban, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Mon-Fri: 8:00 AM - 5:00 PM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="business" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Walk-in consultations welcome</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Email consultations available</Text>
            </View>
          </View>
        )
      
      case 6: // Nyezi Foundation
        return (
          <View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Rural communities, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Flexible hours for community needs</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="school" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>School-based programs</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Community outreach programs</Text>
            </View>
          </View>
        )
      
      default:
        return (
          <View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>Durban, South Africa</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={theme.primaryColor} />
              <Text style={styles.infoValue}>By appointment</Text>
            </View>
          </View>
        )
    }
  }

  // Get specializations
  const getSpecializations = (service) => {
    if (!service || !service.id) {
      return null
    }
    
    switch (service.id) {
      case 1: // Psychology Services
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Individual Therapy & Counseling</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Psychological Assessments</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Trauma & PTSD Treatment</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• African Psychology Integration</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Cultural Counseling</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Stress & Anxiety Management</Text>
            </View>
          </View>
        )
      
      case 2: // Spiritual Interventions
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Traditional African Healing</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Spiritual Cleansing (Ukugezwa)</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Ancestral Communication</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Ubuntu Philosophy Integration</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Cultural Heritage Healing</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Spiritual Guidance & Direction</Text>
            </View>
          </View>
        )
      
      case 3: // Tshabalala Financial
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Personal Loans & Soft Loans</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Business Financing for SMEs</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Debt Consolidation Services</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Credit Counseling & Guidance</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Emergency Financial Assistance</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Community-focused Lending</Text>
            </View>
          </View>
        )
      
      case 4: // Hypnotherapy
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Clinical Hypnotherapy</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Life Coaching & Goal Setting</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Habit Change Programs</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Confidence Building</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Stress Reduction Techniques</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Personal Transformation Plans</Text>
            </View>
          </View>
        )
      
      case 5: // Tshabalala Omkhulu Consulting
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Professional Registrations</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Criminal Clearance Services</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• SACE & PSIRA Registrations</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Business License Applications</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Career Guidance & Consulting</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Traditional Wisdom Integration</Text>
            </View>
          </View>
        )
      
      case 6: // Nyezi Foundation
        return (
          <View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Educational Support Programs</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Rural Community Development</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Youth Mentorship Programs</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Career Guidance & Counseling</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Financial Assistance for Students</Text>
            </View>
            <View style={styles.specializationItem}>
              <Text style={styles.specializationText}>• Community Empowerment Initiatives</Text>
            </View>
          </View>
        )
      
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Simple Background with Theme Colors */}
      <LinearGradient
        colors={[theme.primaryColor, theme.secondaryColor]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Business Image */}
        <View style={styles.imageContainer}>
          {getServiceImage(service) ? (
            <Image 
              source={getServiceImage(service)} 
              style={styles.businessImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.imagePlaceholderText}>
                Business Image
              </Text>
              <Text style={styles.imagePlaceholderSubtext}>
                Space reserved for {service.practitioner} image
              </Text>
            </View>
          )}
        </View>

        {/* Service Content */}
        <View style={[styles.contentContainer, { backgroundColor: theme.cardColor }]}>
          <Text style={[styles.serviceTitle, { color: theme.primaryColor }]}>
            {service.title}
          </Text>
          <Text style={styles.serviceDescription}>
            {service.description}
          </Text>

          {/* Practitioner Info */}
          <View style={styles.practitionerContainer}>
            <Text style={styles.practitionerName}>
              {service.practitioner}
            </Text>
            <Text style={styles.practitionerTitle}>
              {service.practitionerTitle}
            </Text>
          </View>


          {/* Business Information */}
          {getBusinessInfo(service) && (
            <View style={styles.businessInfoContainer}>
              <Text style={styles.sectionTitle}>Business Information</Text>
              {getBusinessInfo(service)}
            </View>
          )}

          {/* Credentials & Certifications */}
          {getCredentials(service) && (
            <View style={styles.credentialsContainer}>
              <Text style={styles.sectionTitle}>Credentials & Certifications</Text>
              {getCredentials(service)}
            </View>
          )}

          {/* Location & Hours */}
          {getLocationInfo(service) && (
            <View style={styles.locationContainer}>
              <Text style={styles.sectionTitle}>Location & Hours</Text>
              {getLocationInfo(service)}
            </View>
          )}

          {/* Specializations */}
          {getSpecializations(service) && (
            <View style={styles.specializationsContainer}>
              <Text style={styles.sectionTitle}>Specializations</Text>
              {getSpecializations(service)}
            </View>
          )}

          {/* Features */}
          {service.features && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Services Include:</Text>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Contact Actions */}
          <View style={styles.actionsContainer}>
            {service.website && (
              <CustomButton
                title="Visit Website"
                onPress={() => handleWebsitePress(service.website)}
                icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
                style={styles.actionButton}
              />
            )}
            
            {service.phone && (
              <CustomButton
                title={`Call: ${service.phone}`}
                onPress={() => handleCallPress(service.phone)}
                variant="outline"
                style={styles.actionButton}
              />
            )}

            {service.office && service.office !== service.phone && (
              <CustomButton
                title={`Office: ${service.office}`}
                onPress={() => handleCallPress(service.office)}
                variant="outline"
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 200,
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  businessImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
  },
  imagePlaceholderSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  practitionerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  practitionerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  practitionerTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 12,
    marginTop: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
  // New comprehensive information styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
    marginTop: 10,
  },
  businessInfoContainer: {
    marginBottom: 20,
  },
  credentialsContainer: {
    marginBottom: 20,
  },
  locationContainer: {
    marginBottom: 20,
  },
  specializationsContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 120,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  specializationItem: {
    marginBottom: 6,
  },
  specializationText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
})

export default ServiceDetailScreen
