// Life Changing Journey Theme Utilities
import { Colors } from './colors';

export const UITheme = {
  // Card styling
  card: {
    standard: {
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    bordered: (color = Colors.secondary) => ({
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }),
  },
  
  // Button styling
  button: {
    primary: {
      backgroundColor: Colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: Colors.secondary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outline: {
      backgroundColor: 'transparent',
      paddingVertical: 13,
      paddingHorizontal: 24,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  
  // Service category styling
  serviceCategory: {
    mentalWellness: {
      color: Colors.mentalWellness.primary,
      lightColor: Colors.mentalWellness.light,
      icon: 'brain-outline',
      title: 'Mental Wellness',
    },
    spiritualGrowth: {
      color: Colors.spiritualGrowth.primary,
      lightColor: Colors.spiritualGrowth.light,
      icon: 'flower-outline',
      title: 'Spiritual Growth',
    },
    financialGuidance: {
      color: Colors.financialGuidance.primary,
      lightColor: Colors.financialGuidance.light,
      icon: 'cash-outline',
      title: 'Financial Guidance',
    },
    psychology: {
      color: Colors.psychology.primary,
      lightColor: Colors.psychology.light,
      icon: 'people-outline',
      title: 'Psychology',
    },
    hypnotherapy: {
      color: Colors.hypnotherapy.primary,
      lightColor: Colors.hypnotherapy.light,
      icon: 'sparkles-outline',
      title: 'Hypnotherapy',
    },
  },
  
  // Input styling
  input: {
    standard: {
      backgroundColor: Colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.lightGray,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    focused: {
      backgroundColor: Colors.surface,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    error: {
      backgroundColor: Colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.error,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }
  },
  
  // Badge styling
  badge: {
    default: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: Colors.primary,
    },
    outline: {
      paddingVertical: 3,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    pill: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: Colors.secondaryAlpha,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.primary,
    }
  },
  
  // Helper functions for category colors
  getCategoryColor: (category) => {
    switch(category) {
      case 'mental_wellness': return Colors.mentalWellness.primary;
      case 'spiritual_growth': return Colors.spiritualGrowth.primary;
      case 'financial_guidance': return Colors.financialGuidance.primary;
      case 'psychology': return Colors.psychology.primary;
      case 'hypnotherapy': return Colors.hypnotherapy.primary;
      default: return Colors.secondary;
    }
  },
  
  getCategoryLightColor: (category) => {
    switch(category) {
      case 'mental_wellness': return Colors.mentalWellness.light;
      case 'spiritual_growth': return Colors.spiritualGrowth.light;
      case 'financial_guidance': return Colors.financialGuidance.light;
      case 'psychology': return Colors.psychology.light;
      case 'hypnotherapy': return Colors.hypnotherapy.light;
      default: return Colors.secondaryAlpha;
    }
  },
  
  getCategoryIcon: (category) => {
    switch(category) {
      case 'mental_wellness': return 'brain-outline';
      case 'spiritual_growth': return 'flower-outline';
      case 'financial_guidance': return 'cash-outline';
      case 'psychology': return 'people-outline';
      case 'hypnotherapy': return 'sparkles-outline';
      default: return 'layers-outline';
    }
  }
};
