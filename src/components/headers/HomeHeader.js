// Home Header with Life Changing Journey branding
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../../styles/typography';
import { useData } from '../../providers/DataProvider';
import { DemoModeBadge } from '../common/DemoModeBadge';

const HomeHeader = ({ scrollY }) => {
  const { demoMode } = useData();
  
  return (
    <LinearGradient
      colors={[Colors.brandDark, Colors.brandDarkAlt]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Life Changing</Text>
            <Text style={styles.subtitle}>Journey</Text>
          </View>
        </View>
        
        {demoMode && <DemoModeBadge style={styles.demoBadge} />}
        
        <Text style={styles.tagline}>
          Transform your life with holistic wellness services
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    ...Typography.textStyles.h2,
    color: Colors.white,
    fontFamily: 'Poppins_600',
  },
  subtitle: {
    ...Typography.textStyles.h3,
    color: Colors.brandGold,
    fontFamily: 'Poppins_600',
    marginTop: -5,
  },
  tagline: {
    ...Typography.textStyles.body,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Poppins_400',
  },
  demoBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
});

export default HomeHeader;
