// Integrated Services Screen - Directory Gateway
import React from 'react'
import { View, Text, ScrollView, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import CustomButton from '../../components/common/CustomButton'

const IntegratedServicesScreen = () => {
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
          Tshabalala Omkhulu Consulting
        </Text>
        <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginBottom: 30 }]}>
          Your one-stop solution for professional registrations, business consulting, and integrated services.
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Fingerprints Criminal Clearance</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Fast processing times to meet your deadlines, providing accurate and secure fingerprint capturing for all your criminal clearance needs. Our team offers professional support throughout the entire process, ensuring a smooth and stress-free experience.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Pre/Post Employment Screening</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Comprehensive screening services to help businesses make informed hiring decisions and maintain a secure workforce. Whether you're vetting new hires or conducting checks on current employees, our screening services provide valuable insights into candidates' backgrounds, ensuring compliance and reducing risks.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>SACE Registration & Renewal</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Hassle-free assistance with SACE Registration and Renewal, ensuring that educators meet the necessary requirements to continue their professional journey. Whether you're registering for the first time or renewing your credentials, we guide you through the process with ease and efficiency.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>PSIRA Registrations</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Professional assistance with PSIRA Registrations, helping security personnel and companies meet the standards set by the Private Security Industry Regulatory Authority (PSIRA). Whether you are an individual seeking registration as a security officer or a business looking to comply with industry regulations, we simplify the process for you.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>UBER/Bolt/InDrive Registration</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Expert support and guidance for drivers looking to register and operate on popular e-hailing platforms like UBER, Bolt, InDrive, and others. Whether you're new to the industry or seeking to expand your opportunities, we help you navigate the requirements, ensuring you meet all standards to get started quickly and smoothly.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>SAIT Registration or Renewal</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Dedicated support for individuals and businesses looking to register with the South African Institute of Tax Professionals (SAIT). As the leading professional body for tax professionals in South Africa, SAIT ensures that tax practitioners maintain high standards of expertise, ethics, and professionalism.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>NCR Registrations</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            We simplify the process of obtaining your NCR registration certificate. Whether you're a credit provider, debt counselor, or credit bureau, we offer expert guidance to ensure a smooth application process. NCR registration is mandatory under the National Credit Act for companies or individuals involved in credit provision, debt counseling, or credit bureau services.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>PDP Applications</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Comprehensive assistance to ensure your PDP (Professional Driving Permit) application process is quick and hassle-free. A PDP is essential for drivers who operate public transport vehicles, heavy-duty trucks, dangerous goods transportation, and tour and charter services.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Gambling License Applications</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            Planning to open a casino, online betting platform, or any form of gambling establishment? We make it easy for you by handling the complexities of the application process. Operating any form of gambling business without a license is illegal. A gambling license ensures that your business is recognized, regulated, and trusted by your clients.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Business Consulting</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • Traditional Wisdom Consultation{'\n'}
            • Business & Career Guidance{'\n'}
            • Life Purpose Discovery{'\n'}
            • Cultural Heritage Integration{'\n'}
            • Personal Development Planning{'\n'}
            • Leadership Development
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Service Excellence</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            • 7+ Experienced Consultants{'\n'}
            • 1,200+ Successful Applications{'\n'}
            • 98% Success Rate{'\n'}
            • 1,880+ Clients Served{'\n'}
            • Fast Processing Times{'\n'}
            • Professional Support Throughout{'\n'}
            • Trusted Service Provider in Durban{'\n'}
            • Reliable and Efficient Services
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Contact Information</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            📍 151 Musgrave Road, Musgrave, Berea, Durban, 4001{'\n'}
            📧 info@tshabalalaomkhulu.co.za{'\n'}
            📞 (069) 308-4723
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
          <Text style={[GlobalStyles.h3, { marginBottom: 15 }]}>Why Choose Tshabalala Omkhulu?</Text>
          <Text style={[GlobalStyles.bodyText, { marginBottom: 15 }]}>
            "One Stop, Every Solution" - We provide comprehensive integrated services designed to make your life easier and more convenient. Our commitment to excellence means we go above and beyond to ensure every client receives prompt, professional, and reliable assistance. Don't risk delays or errors - trust the experts at Tshabalala Omkhulu.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default IntegratedServicesScreen
