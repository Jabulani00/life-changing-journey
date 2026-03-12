/**
 * TimePickerField – native: custom modal with time slots. Web uses TimePickerField.web.js.
 * value: 'HH:mm' string or ''
 * onChange: (timeStr: string) => void
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

const DEFAULT_TIME_SLOTS = (() => {
  const slots = []
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
})()

export default function TimePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select time',
  style,
  disabled = false,
  timeSlots = DEFAULT_TIME_SLOTS,
}) {
  const [showModal, setShowModal] = useState(false)

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
          {value || placeholder}
        </Text>
        <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select time</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.option, value === time && styles.optionSelected]}
                  onPress={() => {
                    onChange(time)
                    setShowModal(false)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, value === time && styles.optionTextSelected]}>
                    {time}
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
