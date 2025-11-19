// Premium Booking Screen - Life Changing Journey
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'
import { staticData } from '../../utils/staticData'

const BookingScreen = ({ navigation, route }) => {
  const [selectedService, setSelectedService] = useState(route?.params?.service || staticData.services[0])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingStep, setBookingStep] = useState(1) // 1: Service, 2: Date/Time, 3: Confirmation

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
      onPress={() => dateItem.isAvailable && setSelectedDate(dateItem)}
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
      onPress={() => setSelectedTime(time)}
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

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Incomplete Booking', 'Please select both date and time for your appointment.')
      return
    }

    Alert.alert(
      'Confirm Booking',
      `Book ${selectedService.title} on ${selectedDate.dayName}, ${selectedDate.dayNumber} ${selectedDate.monthName} at ${selectedTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Booking Confirmed!',
              'Your appointment has been scheduled. You will receive a confirmation email shortly.',
              [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            )
          }
        }
      ]
    )
  }

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
              backgroundColor: Colors.services[service.category],
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
            backgroundColor: Colors.services[selectedService.category],
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

      {/* Progress Indicator */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
      }}>
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: bookingStep >= 1 ? Colors.primary : Colors.lightGray,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        }}>
          <Text style={{
            ...Typography.textStyles.captionBold,
            color: bookingStep >= 1 ? Colors.white : Colors.textSecondary,
          }}>
            1
          </Text>
        </View>
        
        <View style={{
          flex: 1,
          height: 2,
          backgroundColor: bookingStep >= 2 ? Colors.primary : Colors.lightGray,
          marginHorizontal: 8,
        }} />
        
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: bookingStep >= 2 ? Colors.primary : Colors.lightGray,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8,
        }}>
          <Text style={{
            ...Typography.textStyles.captionBold,
            color: bookingStep >= 2 ? Colors.white : Colors.textSecondary,
          }}>
            2
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {bookingStep === 1 ? <ServiceSelectionStep /> : <DateTimeSelectionStep />}
      </ScrollView>

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
          {bookingStep === 2 && (
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
              onPress={() => setBookingStep(1)}
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
              opacity: bookingStep === 1 || (selectedDate && selectedTime) ? 1 : 0.6,
            }}
            onPress={() => {
              if (bookingStep === 1) {
                setBookingStep(2)
              } else {
                handleBooking()
              }
            }}
            disabled={bookingStep === 2 && (!selectedDate || !selectedTime)}
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
                {bookingStep === 1 ? 'Continue' : 'Confirm Booking'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {bookingStep === 2 && selectedDate && selectedTime && (
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
