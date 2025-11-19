// Spiritual Growth Screen - Directory Gateway
import React from 'react'
import { View, Text, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import CustomButton from '../../components/common/CustomButton'

const SpiritualGrowthScreen = () => {
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
          Spiritual Growth & Traditional Healing
        </Text>
        <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginBottom: 30 }]}>
          Connect with traditional African spiritual practices and modern spiritual guidance for holistic healing and growth.
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Spiritual Related Interventions</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Ukugezwa Kwemimoya (Spiritual Cleansing){'\n'}
            • Traditional healing ceremonies{'\n'}
            • Ancestral communication{'\n'}
            • Spiritual guidance & direction{'\n'}
            • Ubuntu philosophy integration{'\n'}
            • Cultural heritage healing
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
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Tshabalala Omkhulu Consulting</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Traditional wisdom consultation{'\n'}
            • Life purpose discovery{'\n'}
            • Cultural heritage integration{'\n'}
            • Personal development planning{'\n'}
            • Leadership development{'\n'}
            • Business & career guidance
          </Text>
          
          <CustomButton
            title="Visit"
            icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
            onPress={() => handleWebsitePress('https://tshabalalaomkhulu.co.za')}
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Call: (069) 308-4723"
            onPress={() => handleCallPress('+27693084723')}
            variant="outline"
          />
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Integrated Approach</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Our spiritual growth services combine traditional African healing practices with modern psychological understanding, creating a holistic approach to personal transformation and spiritual development.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default SpiritualGrowthScreen
