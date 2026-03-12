/**
 * DatePickerField – web: HTML5 input type="date". Native version is DatePickerField.js.
 */
import React from 'react'
import { Text, View } from 'react-native'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

function toISODateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
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
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        min={minimumDate ? toISODateString(new Date(minimumDate)) : undefined}
        max={maximumDate ? toISODateString(new Date(maximumDate)) : undefined}
        disabled={disabled}
        style={inputStyle}
      />
    </View>
  )
}
