/**
 * TimePickerField – web: HTML5 input type="time". Native version is TimePickerField.js.
 */
import React from 'react'
import { Text, View } from 'react-native'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

export default function TimePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select time',
  style,
  disabled = false,
}) {
  const inputStyle = {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    minHeight: 48,
  }
  const Input = (props) => React.createElement('input', props)
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {label ? (
        <Text
          style={{
            ...Typography.textStyles.captionBold,
            color: Colors.textPrimary,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      ) : null}
      <Input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        disabled={disabled}
        style={inputStyle}
      />
    </View>
  )
}
