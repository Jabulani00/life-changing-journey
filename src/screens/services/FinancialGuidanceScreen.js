// Financial Guidance Screen - Directory Gateway
import React from 'react'
import { View, Text, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import CustomButton from '../../components/common/CustomButton'

const FinancialGuidanceScreen = () => {
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
          Financial Services
        </Text>
        <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginBottom: 30 }]}>
          Access comprehensive financial services including personal loans, financial planning, and money management guidance.
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Tshabalala Omhle Financial Group</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Welcome to Tshabalala Omhle Financial Group, your trusted partner in achieving financial success and stability. Based in Durban, South Africa, we are a proudly Black-owned enterprise dedicated to providing accessible, transparent, and effective financial solutions.
          </Text>
          
          <Text style={[GlobalStyles.h4, { marginBottom: 10, marginTop: 15 }]}>Our Services:</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Soft Loans - Quick, accessible funding with flexible terms{'\n'}
            • Personal Loans - Competitive rates and manageable repayment{'\n'}
            • Business Financing - Customized options for SMEs{'\n'}
            • Debt Consolidation - Simplify your finances{'\n'}
            • Credit Counseling - Expert financial guidance{'\n'}
            • NCR Registered (NCRCP20083)
          </Text>
          
          <CustomButton
            title="Visit"
            icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
            onPress={() => handleWebsitePress('https://tshabalalafinance.co.za')}
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Call: (069) 308-4723"
            onPress={() => handleCallPress('+27693084723')}
            variant="outline"
          />
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Tshabalala Omkhulu Consulting</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Integrated services provider{'\n'}
            • Business consulting{'\n'}
            • Professional registrations{'\n'}
            • One-stop service solution
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
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Nyezi Vuyani Foundation</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Nyezi Foundation is a non-profit organization driven by a passion for education and a deep commitment to rural communities. We believe that every child, regardless of where they come from, deserves the chance to learn, grow, and achieve their dreams.
          </Text>
          
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Founded with the purpose of bridging the educational gap between urban and rural areas, we provide financial assistance to learners from disadvantaged rural backgrounds—supporting them from high school through to university. Our work goes beyond paying school fees; we invest in the potential of young minds by offering mentorship, career guidance, and personal development opportunities.
          </Text>
          
          <Text style={[GlobalStyles.h4, { marginBottom: 10, marginTop: 15 }]}>Our Mission:</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Educational support for rural communities{'\n'}
            • Financial assistance for learners{'\n'}
            • Mentorship and career guidance{'\n'}
            • Personal development opportunities{'\n'}
            • Community development programs{'\n'}
            • Bridging urban-rural educational gaps
          </Text>
          
          <CustomButton
            title="Visit"
            icon={<Ionicons name="paper-plane-outline" size={16} color={Colors.white} />}
            onPress={() => handleWebsitePress('https://www.nyezivfoundation.co.za/')}
            style={{ marginBottom: 10 }}
          />
          
          <CustomButton
            title="Call: 074 067 4650"
            onPress={() => handleCallPress('+27740674650')}
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default FinancialGuidanceScreen
