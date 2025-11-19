// Profile Screen
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import CustomInput from '../../components/common/CustomInput'
import CustomButton from '../../components/common/CustomButton'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'

const ProfileScreen = ({ navigation }) => {
  const { user, getUserProfile, updateProfile, signOut } = useAuth()
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
