// Premium Booking Screen - Life Changing Journey
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DatePickerField from '../../components/common/DatePickerField'
import TimePickerField from '../../components/common/TimePickerField'
import { useAuth } from '../../context/AuthContext'
import { createBooking } from '../../services/firebase'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'

const isWeb = Platform.OS === 'web'

const inputStyle = {
  borderWidth: 1,
  borderColor: Colors.lightGray,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 12,
  ...Typography.textStyles.body,
  color: Colors.textPrimary,
}

const BookingScreen = ({ navigation, route }) => {
  const { user } = useAuth()
  const [selectedService, setSelectedService] = useState(route?.params?.service || staticData.services[0])
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(user?.email ?? user?.user_metadata?.email ?? '')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [pickerDate, setPickerDate] = useState('') // ISO date from date picker
  const [pickerTime, setPickerTime] = useState('') // HH:mm from time picker
  const [notes, setNotes] = useState('')
  const [bookingStep, setBookingStep] = useState(1) // 1: Service, 2: Your details, 3: Date/Time

  // Generate available dates for the next 30 days
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          monthName: date.toLocaleDateString('en-US', { month: 'short' }),
          isAvailable: Math.random() > 0.3 // 70% availability simulation
        })
      }
    }
    
    return dates.slice(0, 14) // Show next 2 weeks
  }

  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const [availableDates] = useState(generateAvailableDates())

  const DateCard = ({ dateItem, isSelected }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isSelected ? Colors.primary : Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 80,
        borderWidth: 2,
        borderColor: isSelected ? Colors.primary : Colors.lightGray,
        opacity: dateItem.isAvailable ? 1 : 0.4,
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => {
        if (dateItem.isAvailable) {
          setSelectedDate(dateItem)
          setPickerDate('')
        }
      }}
      disabled={!dateItem.isAvailable}
      activeOpacity={0.9}
    >
      <Text style={{
        ...Typography.textStyles.captionBold,
        color: isSelected ? Colors.white : Colors.textSecondary,
        marginBottom: 4,
      }}>
        {dateItem.dayName}
      </Text>
      <Text style={{
        ...Typography.textStyles.h5,
        color: isSelected ? Colors.white : Colors.textPrimary,
        marginBottom: 2,
      }}>
        {dateItem.dayNumber}
      </Text>
      <Text style={{
        ...Typography.textStyles.caption,
        color: isSelected ? Colors.white : Colors.textSecondary,
      }}>
        {dateItem.monthName}
      </Text>
      
      {!dateItem.isAvailable && (
        <View style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: Colors.error,
        }} />
      )}
    </TouchableOpacity>
  )

  const TimeSlot = ({ time, isSelected }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isSelected ? Colors.primary : Colors.surface,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: isSelected ? Colors.primary : Colors.lightGray,
      }}
      onPress={() => {
        setSelectedTime(time)
        setPickerTime('')
      }}
      activeOpacity={0.9}
    >
      <Text style={{
        ...Typography.textStyles.bodySmall,
        color: isSelected ? Colors.white : Colors.textPrimary,
        fontWeight: isSelected ? 'bold' : 'normal',
      }}>
        {time}
      </Text>
    </TouchableOpacity>
  )

  const handleBooking = async () => {
    const trim = (s) => (s && String(s).trim()) || ''
    const name = trim(firstName)
    const sur = trim(surname)
    const ph = trim(phone)
    const em = trim(email)
    if (!name || !sur || !ph || !em) {
      if (isWeb) window.alert('Please enter your first name, surname, phone number and email.')
      else Alert.alert('Missing details', 'Please enter your first name, surname, phone number and email.')
      return
    }
    const hasCardSelection = selectedDate && selectedTime
    const hasPickerSelection = pickerDate && pickerTime
    if (!hasCardSelection && !hasPickerSelection) {
      if (isWeb) window.alert('Please select both date and time for your appointment.')
      else Alert.alert('Incomplete Booking', 'Please select both date and time for your appointment.')
      return
    }

    let dateStr, time
    if (hasPickerSelection) {
      const d = new Date(pickerDate)
      dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }) + ', ' + d.getDate() + ' ' + d.toLocaleDateString('en-US', { month: 'short' })
      time = pickerTime
    } else {
      dateStr = selectedDate.dayName + ', ' + selectedDate.dayNumber + ' ' + selectedDate.monthName
      time = selectedTime
    }
    const userId = user?.id ?? user?.user?.id ?? 'guest'

    try {
      await createBooking({
        userId,
        userEmail: em,
        name,
        surname: sur,
        phone: ph,
        email: em,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        date: dateStr,
        time,
        status: 'pending',
        notes: notes.trim() || null,
      })
      if (isWeb) {
        window.alert('Booking Confirmed! Your appointment has been saved. You can view it in My Bookings.')
        navigation.navigate('Home')
      } else {
        Alert.alert(
          'Booking Confirmed!',
          'Your appointment has been saved. You can view it in My Bookings.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        )
      }
    } catch (e) {
      const msg = e?.message || 'Could not save booking. Please try again.'
      if (isWeb) window.alert('Booking failed: ' + msg)
      else Alert.alert('Booking failed', msg)
    }
  }

  const ContactDetailsStep = () => (
    <View>
      <Text style={{
        ...Typography.textStyles.h4,
        color: Colors.textPrimary,
        marginBottom: 16,
      }}>
        Your details
      </Text>
      <Text style={{
        ...Typography.textStyles.bodySmall,
        color: Colors.textSecondary,
        marginBottom: 16,
      }}>
        We'll use this to confirm your appointment.
      </Text>
      <TextInput
        style={inputStyle}
        placeholder="First name *"
        placeholderTextColor={Colors.textMuted}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={inputStyle}
        placeholder="Surname *"
        placeholderTextColor={Colors.textMuted}
        value={surname}
        onChangeText={setSurname}
        autoCapitalize="words"
      />
      <TextInput
        style={inputStyle}
        placeholder="Phone number *"
        placeholderTextColor={Colors.textMuted}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={inputStyle}
        placeholder="Email *"
        placeholderTextColor={Colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={{
        ...Typography.textStyles.caption,
        color: Colors.textSecondary,
        marginTop: 8,
        marginBottom: 6,
      }}>
        Notes (optional) – e.g. what you’d like to focus on
      </Text>
      <TextInput
        style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder="Add any notes before confirming..."
        placeholderTextColor={Colors.textMuted}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />
    </View>
  )

  const ServiceSelectionStep = () => (
    <View>
      <Text style={{
        ...Typography.textStyles.h4,
        color: Colors.textPrimary,
        marginBottom: 16,
      }}>
        Select Service
      </Text>
      
      {staticData.services.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={{
            backgroundColor: selectedService.id === service.id ? Colors.primaryAlpha : Colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 2,
            borderColor: selectedService.id === service.id ? Colors.primary : Colors.lightGray,
          }}
          onPress={() => setSelectedService(service)}
          activeOpacity={0.9}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: Colors.services?.[service.category] ?? Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons name={service.icon} size={24} color={Colors.white} />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.textStyles.h6,
                color: Colors.textPrimary,
                marginBottom: 4,
              }}>
                {service.title}
              </Text>
              <Text style={{
                ...Typography.textStyles.caption,
                color: Colors.textSecondary,
                marginBottom: 8,
              }}>
                {service.duration} • {service.practitioner}
              </Text>
              <Text style={{
                ...Typography.textStyles.bodyBold,
                color: Colors.primary,
              }}>
                R{service.price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  const DateTimeSelectionStep = () => (
    <View>
      {/* Selected Service Summary */}
      <View style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.lightGray,
      }}>
        <Text style={{
          ...Typography.textStyles.captionBold,
          color: Colors.primary,
          marginBottom: 8,
        }}>
          SELECTED SERVICE
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.services?.[selectedService.category] ?? Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Ionicons name={selectedService.icon} size={20} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              ...Typography.textStyles.h6,
              color: Colors.textPrimary,
            }}>
              {selectedService.title}
            </Text>
            <Text style={{
              ...Typography.textStyles.caption,
              color: Colors.textSecondary,
            }}>
              {selectedService.duration} • R{selectedService.price}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Selection */}
      <Text style={{
        ...Typography.textStyles.h5,
        color: Colors.textPrimary,
        marginBottom: 16,
      }}>
        Select Date
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 32 }}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {availableDates.map((dateItem, index) => (
          <DateCard 
            key={index}
            dateItem={dateItem}
            isSelected={selectedDate?.date?.getTime() === dateItem.date.getTime()}
          />
        ))}
      </ScrollView>

      {/* Time Selection */}
      {selectedDate && (
        <View>
          <Text style={{
            ...Typography.textStyles.h5,
            color: Colors.textPrimary,
            marginBottom: 16,
          }}>
            Select Time
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 24,
          }}>
            {availableTimes.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedTime === time}
              />
            ))}
          </View>
        </View>
      )}

      {/* Or use date/time pickers */}
      <Text style={{
        ...Typography.textStyles.h5,
        color: Colors.textPrimary,
        marginTop: 8,
        marginBottom: 12,
      }}>
        Or pick date and time
      </Text>
      <DatePickerField
        label="Date"
        placeholder="Select date"
        value={pickerDate}
        onChange={(v) => {
          setPickerDate(v)
          setSelectedDate(null)
        }}
        minimumDate={new Date()}
      />
      <TimePickerField
        label="Time"
        placeholder="Select time"
        value={pickerTime}
        onChange={(v) => {
          setPickerTime(v)
          setSelectedTime(null)
        }}
      />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.textStyles.h3,
            color: Colors.white,
            marginBottom: 4,
          }}>
            Book Appointment
          </Text>
          <Text style={{
            ...Typography.textStyles.bodySmall,
            color: Colors.white,
            opacity: 0.9,
          }}>
            Schedule your wellness session
          </Text>
        </View>
      </LinearGradient>

      {/* Progress Indicator (3 steps) */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
      }}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: bookingStep >= step ? Colors.primary : Colors.lightGray,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                ...Typography.textStyles.captionBold,
                fontSize: 12,
                color: bookingStep >= step ? Colors.white : Colors.textSecondary,
              }}>
                {step}
              </Text>
            </View>
            {step < 3 && (
              <View style={{
                flex: 1,
                height: 2,
                backgroundColor: bookingStep > step ? Colors.primary : Colors.lightGray,
                marginHorizontal: 4,
              }} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {bookingStep === 1 && <ServiceSelectionStep />}
          {bookingStep === 2 && <ContactDetailsStep />}
          {bookingStep === 3 && <DateTimeSelectionStep />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Actions */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        padding: 16,
        paddingBottom: 32,
      }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {bookingStep > 1 && (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.backgroundSecondary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              onPress={() => setBookingStep(bookingStep - 1)}
            >
              <Text style={{
                ...Typography.textStyles.button,
                color: Colors.textPrimary,
              }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={{
              flex: bookingStep === 1 ? 1 : 2,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: (bookingStep === 1) || (bookingStep === 2 && firstName.trim() && surname.trim() && phone.trim() && email.trim()) || (bookingStep === 3 && selectedDate && selectedTime) ? 1 : 0.6,
            }}
            onPress={() => {
              if (bookingStep === 1) setBookingStep(2)
              else if (bookingStep === 2) setBookingStep(3)
              else handleBooking()
            }}
            disabled={
              (bookingStep === 2 && (!firstName.trim() || !surname.trim() || !phone.trim() || !email.trim())) ||
              (bookingStep === 3 && (!selectedDate || !selectedTime))
            }
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                ...Typography.textStyles.button,
                color: Colors.white,
              }}>
                {bookingStep === 1 ? 'Continue' : bookingStep === 2 ? 'Continue' : 'Confirm Booking'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {bookingStep === 3 && selectedDate && selectedTime && (
          <View style={{
            backgroundColor: Colors.backgroundSecondary,
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
          }}>
            <Text style={{
              ...Typography.textStyles.captionBold,
              color: Colors.primary,
              marginBottom: 4,
            }}>
              BOOKING SUMMARY
            </Text>
            <Text style={{
              ...Typography.textStyles.bodySmall,
              color: Colors.textPrimary,
            }}>
              {selectedService.title} • {selectedDate.dayName}, {selectedDate.dayNumber} {selectedDate.monthName} at {selectedTime}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default BookingScreen
