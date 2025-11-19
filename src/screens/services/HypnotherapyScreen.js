// Hypnotherapy Screen - Directory Gateway
import React from 'react'
import { View, Text, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import CustomButton from '../../components/common/CustomButton'

const HypnotherapyScreen = () => {
  const handleWebsitePress = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website. Please check your internet connection.')
    })
  }

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make call. Please check your device settings.')
    })
  }

  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={[GlobalStyles.centerContainer, { padding: 20 }]}>
        <Text style={[GlobalStyles.h1, { color: Colors.primary, marginBottom: 10 }]}>
          Hypnotherapy & Life Coaching
        </Text>
        <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginBottom: 30 }]}>
          Transform your life through professional hypnotherapy sessions and life coaching to overcome limiting beliefs and unlock your full potential.
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Life Changing Journey Hypnotherapy</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Clinical hypnotherapy sessions{'\n'}
            • Life coaching & goal setting{'\n'}
            • Habit change programs{'\n'}
            • Confidence building{'\n'}
            • Stress reduction techniques{'\n'}
            • Personal transformation plans
          </Text>
          
          <CustomButton
            title="Visit"
            icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
            onPress={() => handleWebsitePress('https://lifechangingjourney.co.za')}
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Call: 031 035 0208"
            onPress={() => handleCallPress('+27310350208')}
            variant="outline"
          />
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Vuyani Nyezi - Counselling Psychologist</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • 12+ years of experience{'\n'}
            • Hypnotherapy integration{'\n'}
            • Traditional & modern approaches{'\n'}
            • Individual therapy sessions{'\n'}
            • Personal development focus
          </Text>
          
          <CustomButton
            title="Visit"
            icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
            onPress={() => handleWebsitePress('https://psychologistdurban.co.za')}
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Call: 067 280 3432"
            onPress={() => handleCallPress('+27672803432')}
            variant="outline"
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Office: 031 035 0208"
            onPress={() => handleCallPress('+27310350208')}
            variant="outline"
          />
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>What to Expect</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Safe and professional environment{'\n'}
            • Personalized treatment plans{'\n'}
            • Evidence-based techniques{'\n'}
            • Holistic approach to healing{'\n'}
            • Support for lasting change{'\n'}
            • Integration of traditional wisdom
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default HypnotherapyScreen
