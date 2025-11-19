// Network status monitor component for Life Changing Journey
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../../utils/networkUtils';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

const NetworkStatusBar = () => {
  const { isConnected, connectionType } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const translateY = new Animated.Value(-60);
  
  useEffect(() => {
    // Don't show when connected to wifi or cellular
    if (isConnected && 
        (connectionType === 'wifi' || connectionType === 'cellular')) {
      hideBar();
      return;
    }
    
    // Show when not connected or on limited connection
    showBar();
    
    // Hide after a delay if connected (but not wifi/cellular)
    if (isConnected) {
      const timer = setTimeout(() => {
        hideBar();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, connectionType]);
  
  const showBar = () => {
    setVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: false,
      tension: 80,
      friction: 9,
    }).start();
  };
  
  const hideBar = () => {
    Animated.timing(translateY, {
      toValue: -60,
      useNativeDriver: false,
      duration: 300,
    }).start(() => {
      setVisible(false);
    });
  };
  
  if (!visible) return null;
  
  // Determine icon and color based on connection
  let icon = 'cloud-offline-outline';
  let backgroundColor = Colors.error;
  let message = 'No internet connection';
  
  if (isConnected) {
    if (connectionType === 'wifi') {
      icon = 'wifi-outline';
      backgroundColor = Colors.success;
      message = 'Connected to WiFi';
    } else if (connectionType === 'cellular') {
      icon = 'cellular-outline';
      backgroundColor = Colors.success;
      message = 'Connected to mobile data';
    } else if (connectionType === 'unknown') {
      icon = 'help-circle-outline';
      backgroundColor = Colors.warning;
      message = 'Limited connection';
    } else {
      icon = 'alert-circle-outline';
      backgroundColor = Colors.warning;
      message = 'Limited connection';
    }
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }], backgroundColor }
      ]}
    >
      <Ionicons name={icon} size={20} color={Colors.white} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 1000,
  },
  text: {
    ...Typography.textStyles.small,
    color: Colors.white,
    marginLeft: 8,
    fontFamily: 'Poppins_500',
  }
});

export default NetworkStatusBar;
