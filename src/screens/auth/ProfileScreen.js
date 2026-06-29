// Profile Screen
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CustomButton from '../../components/common/CustomButton'
import CustomInput from '../../components/common/CustomInput'
import DatePickerField from '../../components/common/DatePickerField'
import { TERMS_LEGAL_URL } from '../../data/termsAndPolicies'
import { useAuth } from '../../context/AuthContext'
import { Colors } from '../../styles/colors'
import { GlobalStyles } from '../../styles/globalStyles'
import { Typography } from '../../styles/typography'

const ProfileScreen = ({ navigation }) => {
  const { user, getUserProfile, updateProfile, signOut, deleteAccount, canDeleteAccount } = useAuth()
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
  })
  const [loading, setLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

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
          date_of_birth: data.date_of_birth || '',
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
          },
        },
      ]
    )
  }

  const openLegalUrl = () => {
    Linking.openURL(TERMS_LEGAL_URL).catch(() => {
      Alert.alert('Error', 'Could not open the legal page.')
    })
  }

  const handleDeleteAccountPress = () => {
    Alert.alert(
      'Delete Account',
      'This permanently deletes your account, profile, and membership access. Booking history will be anonymized. Transaction records may be retained as required by law.\n\nThis cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            setDeletePassword('')
            setDeleteModalVisible(true)
          },
        },
      ]
    )
  }

  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Password required', 'Enter your password to confirm account deletion.')
      return
    }
    setDeleting(true)
    try {
      const { error } = await deleteAccount(deletePassword)
      setDeleteModalVisible(false)
      setDeletePassword('')
      if (error) {
        Alert.alert('Could not delete account', error.message || 'Please try again.')
      } else {
        Alert.alert(
          'Account deleted',
          'Your account has been permanently deleted.',
          [{ text: 'OK' }]
        )
      }
    } catch (_) {
      Alert.alert('Error', 'Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <ScrollView style={GlobalStyles.container}>
      <StatusBar style="dark" />

      <View style={GlobalStyles.paddingContainer}>
        <View style={[GlobalStyles.center, { marginVertical: 32 }]}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Ionicons name="person" size={50} color={Colors.white} />
          </View>
          <Text style={GlobalStyles.h2}>{profile.full_name || 'User'}</Text>
          <Text style={GlobalStyles.captionText}>{user?.email}</Text>
        </View>

        <CustomInput
          label="Full Name"
          placeholder="Enter your full name"
          value={profile.full_name}
          onChangeText={(value) => setProfile({ ...profile, full_name: value })}
        />

        <CustomInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={profile.phone}
          onChangeText={(value) => setProfile({ ...profile, phone: value })}
          keyboardType="phone-pad"
        />

        <DatePickerField
          label="Date of Birth"
          placeholder="Select date of birth"
          value={profile.date_of_birth}
          onChange={(value) => setProfile({ ...profile, date_of_birth: value })}
          maximumDate={new Date()}
        />

        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={GlobalStyles.bodyText}>My Bookings</Text>
          <Text style={GlobalStyles.captionText}>View your appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkCard} onPress={openLegalUrl}>
          <Text style={GlobalStyles.bodyText}>Privacy Policy & Terms</Text>
          <Text style={GlobalStyles.captionText}>View our legal policies</Text>
        </TouchableOpacity>

        <CustomButton
          title="Update Profile"
          onPress={handleUpdateProfile}
          loading={loading}
          style={{ marginTop: 24 }}
        />

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.logoutBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.white} />
          <Text style={styles.logoutBtnText}>Log out</Text>
        </TouchableOpacity>

        {canDeleteAccount ? (
          <TouchableOpacity
            onPress={handleDeleteAccountPress}
            style={styles.deleteBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={styles.deleteBtnText}>Delete account</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !deleting && setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm deletion</Text>
            <Text style={styles.modalBody}>
              Enter your password to permanently delete your account.
            </Text>
            <CustomInput
              label="Password"
              placeholder="Your password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDelete}
                onPress={handleConfirmDelete}
                disabled={deleting}
              >
                <Text style={styles.modalDeleteText}>{deleting ? 'Deleting…' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  linkCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.error,
    borderRadius: 12,
  },
  logoutBtnText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.white,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  deleteBtnText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    ...Typography.textStyles.h3,
    marginBottom: 8,
  },
  modalBody: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.textSecondary,
  },
  modalDelete: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.error,
    borderRadius: 10,
  },
  modalDeleteText: {
    ...Typography.textStyles.bodyBold,
    color: Colors.white,
  },
})

export default ProfileScreen
