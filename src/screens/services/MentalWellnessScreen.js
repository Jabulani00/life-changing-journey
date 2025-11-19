// Mental Wellness Screen - Directory Gateway
import React from 'react'
import { View, Text, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import CustomButton from '../../components/common/CustomButton'

const MentalWellnessScreen = () => {
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
          Mental Wellness Services
        </Text>
        <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginBottom: 30 }]}>
          Professional psychological support and therapy services to help you achieve mental wellness and emotional balance.
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Vuyani Nyezi - Counselling Psychologist</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • 12+ years of experience{'\n'}
            • Individual therapy sessions{'\n'}
            • Stress & anxiety management{'\n'}
            • Depression support{'\n'}
            • Trauma counseling{'\n'}
            • African psychology integration
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
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Life Changing Journey</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Holistic wellness approach{'\n'}
            • Mental health resources{'\n'}
            • Community support{'\n'}
            • Transformative programs
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
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Specialized Areas</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • African psychology & spirituality{'\n'}
            • Indigenous knowledge systems{'\n'}
            • Cultural aspects of counseling{'\n'}
            • Family dynamics & relationships{'\n'}
            • Bereavement & grief counseling{'\n'}
            • Substance dependency support{'\n'}
            • HIV/AIDS counseling{'\n'}
            • Anger & conflict management
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default MentalWellnessScreen
