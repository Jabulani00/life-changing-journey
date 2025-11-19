// Custom Button Component
import React from 'react'
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native'
import { GlobalStyles } from '../../styles/globalStyles'
import { Colors } from '../../styles/colors'

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    let baseStyle = [GlobalStyles.button]
    
    if (variant === 'secondary') {
      baseStyle = [GlobalStyles.secondaryButton]
    } else if (variant === 'outline') {
      baseStyle = [GlobalStyles.secondaryButton]
    } else if (variant === 'danger') {
      baseStyle = [GlobalStyles.button, { backgroundColor: Colors.error }]
    }
    
    if (size === 'small') {
      baseStyle.push({ paddingVertical: 8, paddingHorizontal: 16 })
    } else if (size === 'large') {
      baseStyle.push({ paddingVertical: 16, paddingHorizontal: 32 })
    }
    
    if (disabled) {
      baseStyle.push({ opacity: 0.6 })
    }
    
    return baseStyle
  }

  const getTextStyle = () => {
    let baseStyle = [GlobalStyles.buttonText]
    
    if (variant === 'secondary' || variant === 'outline') {
      baseStyle = [GlobalStyles.secondaryButtonText]
    }
    
    if (size === 'small') {
      baseStyle.push({ fontSize: 14 })
    } else if (size === 'large') {
      baseStyle.push({ fontSize: 18 })
    }
    
    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={[GlobalStyles.row, GlobalStyles.center]}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'secondary' || variant === 'outline' ? Colors.primary : Colors.white} 
            style={{ marginRight: 8 }}
          />
        )}
        {icon && !loading && (
          <View style={{ marginRight: 8 }}>
            {icon}
          </View>
        )}
        <Text style={[...getTextStyle(), textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton
