/**
 * DatePickerField – native: custom modal with date list. Web uses DatePickerField.web.js.
 * value: ISO date string (YYYY-MM-DD) or ''
 * onChange: (isoDateString: string) => void
 */
import React, { useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../styles/colors'
import { Typography } from '../../styles/typography'

function formatDisplayDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return isoStr
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function toISODateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildDateOptions(minDate, maxDate, count = 120) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = minDate ? new Date(minDate) : today
  start.setHours(0, 0, 0, 0)
  let end
  if (maxDate) {
    end = new Date(maxDate)
    end.setHours(23, 59, 59, 999)
  } else {
    end = new Date(start)
    end.setDate(end.getDate() + count)
  }
  const options = []
  const cursor = new Date(start)
  while (cursor <= end && options.length < count) {
    options.push({
      iso: toISODateString(cursor),
      label: cursor.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return options
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
  const [showModal, setShowModal] = useState(false)
  const dateOptions = useMemo(
    () => buildDateOptions(minimumDate, maximumDate),
    [minimumDate, maximumDate]
  )

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select date</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
              {dateOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.iso}
                  style={[styles.option, value === opt.iso && styles.optionSelected]}
                  onPress={() => {
                    onChange(opt.iso)
                    setShowModal(false)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, value === opt.iso && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    ...Typography.textStyles.captionBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputDisabled: { backgroundColor: Colors.surface, opacity: 0.7 },
  inputText: { ...Typography.textStyles.body, color: Colors.textPrimary, flex: 1 },
  placeholder: { color: Colors.textMuted },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: { ...Typography.textStyles.h6, color: Colors.textPrimary },
  doneText: { ...Typography.textStyles.bodyBold, color: Colors.primary },
  scroll: { maxHeight: 320 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  optionSelected: { backgroundColor: Colors.primaryAlpha },
  optionText: { ...Typography.textStyles.body, color: Colors.textPrimary },
  optionTextSelected: { ...Typography.textStyles.bodyBold, color: Colors.primary },
})
