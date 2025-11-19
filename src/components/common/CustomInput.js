// Custom Input Component
import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const inputContainerStyle = [
    GlobalStyles.input,
    isFocused && GlobalStyles.inputFocused,
    error && { borderColor: Colors.error },
    disabled && { backgroundColor: Colors.lightGray, opacity: 0.6 },
    inputStyle,
  ]

  return (
    <View style={[{ marginVertical: 8 }, style]}>
      {label && (
        <Text style={{
          fontSize: Typography.fontSize.sm,
          fontWeight: Typography.fontWeight.medium,
          color: Colors.textPrimary,
          marginBottom: 4,
        }}>
          {label}
        </Text>
      )}
      
      <View style={[inputContainerStyle, { flexDirection: 'row', alignItems: 'center' }]}>
        {leftIcon && (
          <View style={{ marginRight: 8 }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={{
            flex: 1,
            fontSize: Typography.fontSize.md,
            color: Colors.textPrimary,
            paddingVertical: 0,
          }}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={{ marginLeft: 8 }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={{
          fontSize: Typography.fontSize.sm,
          color: Colors.error,
          marginTop: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  )
}

export default CustomInput
