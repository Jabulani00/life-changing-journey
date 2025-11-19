// Service Category Card with Life Changing Journey branding
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { UITheme } from '../../styles/theme';

/**
 * Service Category Card component
 * @param {Object} props
 * @param {string} props.id - Category ID
 * @param {string} props.name - Category name
 * @param {string} props.icon - Ionicons name
 * @param {boolean} props.isSelected - If category is selected
 * @param {Function} props.onPress - On press handler
 */
const ServiceCategoryCard = ({ 
  id, 
  name, 
  icon = 'grid-outline',
  isSelected = false, 
  onPress 
}) => {
  // Get category styling
  const categoryStyle = UITheme.serviceCategory[id] || UITheme.serviceCategory.default;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        categoryStyle.container,
        isSelected && styles.selectedContainer,
        isSelected && { backgroundColor: categoryStyle.background }
      ]}
    >
      <View 
        style={[
          styles.iconContainer,
          { backgroundColor: isSelected ? Colors.white : categoryStyle.background }
        ]}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={isSelected ? categoryStyle.background : Colors.white} 
        />
      </View>
      <Text 
        style={[
          styles.name,
          isSelected && styles.selectedName
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    minWidth: 100,
    maxWidth: 150,
  },
  selectedContainer: {
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  name: {
    ...Typography.textStyles.button,
    color: Colors.text,
    fontFamily: 'Poppins_500',
    fontSize: 13,
    flex: 1,
  },
  selectedName: {
    color: Colors.white,
    fontFamily: 'Poppins_600',
  }
});

export default ServiceCategoryCard;
