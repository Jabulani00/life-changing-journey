// Demo Mode indicator for Life Changing Journey
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

/**
 * Badge that shows when app is using demo data
 * @param {Object} props
 * @param {Object} props.style - Additional styles
 * @param {Function} props.onPress - Optional function to call when pressed
 */
const DemoModeBadge = ({ style, onPress }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="flask-outline" size={14} color={Colors.white} />
      <Text style={styles.text}>DEMO MODE</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  text: {
    ...Typography.textStyles.caption,
    color: Colors.white,
    marginLeft: 4,
    fontFamily: 'Poppins_600',
    fontSize: 10,
  }
});

export default DemoModeBadge;
