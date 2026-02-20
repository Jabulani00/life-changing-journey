// Profile Screen
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CustomButton from '../../components/common/CustomButton'
import CustomInput from '../../components/common/CustomInput'
import { useAuth } from '../../context/AuthContext'
import { Colors } from '../../styles/colors'
import { GlobalStyles } from '../../styles/globalStyles'

const ProfileScreen = ({ navigation }) => {
  const { user, getUserProfile, updateProfile, signOut, admin } = useAuth()
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    date_of_birth: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data } = await getUserProfile()
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || ''
        })
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile(profile)
      
      if (error) {
        Alert.alert('Error', error.message)
      } else {
        Alert.alert('Success', 'Profile updated successfully')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut()
            if (error) {
              Alert.alert('Error', 'Failed to sign out')
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={GlobalStyles.container}>
      <StatusBar style="dark" />
      
      <View style={GlobalStyles.paddingContainer}>
        {/* Profile Header */}
        <View style={[GlobalStyles.center, { marginVertical: 32 }]}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Ionicons name="person" size={50} color={Colors.white} />
          </View>
          <Text style={GlobalStyles.h2}>
            {profile.full_name || 'User'}
          </Text>
          <Text style={GlobalStyles.captionText}>
            {user?.email}
          </Text>
        </View>

        {/* Profile Form */}
        <CustomInput
          label="Full Name"
          placeholder="Enter your full name"
          value={profile.full_name}
          onChangeText={(value) => setProfile({...profile, full_name: value})}
        />

        <CustomInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={profile.phone}
          onChangeText={(value) => setProfile({...profile, phone: value})}
          keyboardType="phone-pad"
        />

        <CustomInput
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={profile.date_of_birth}
          onChangeText={(value) => setProfile({...profile, date_of_birth: value})}
        />

        <TouchableOpacity
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: Colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={GlobalStyles.bodyText}>My Bookings</Text>
          <Text style={GlobalStyles.captionText}>View your appointments</Text>
        </TouchableOpacity>

        {admin && (
          <TouchableOpacity
            style={{
              marginTop: 12,
              padding: 16,
              backgroundColor: Colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.secondary,
            }}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={[GlobalStyles.bodyText, { color: Colors.secondary }]}>Admin</Text>
            <Text style={GlobalStyles.captionText}>Post events & view bookings</Text>
          </TouchableOpacity>
        )}

        <CustomButton
          title="Update Profile"
          onPress={handleUpdateProfile}
          loading={loading}
          style={{ marginTop: 24 }}
        />

        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="danger"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  )
}

export default ProfileScreen
