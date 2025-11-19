// Life Changing Journey Brand Colors - Based on exact logo and website
export const Colors = {
  // Primary Brand Colors
  brandDark: '#012630',       // Tree trunk dark teal
  primary: '#012630',         // Primary color (matches tree trunk)
  primaryDark: '#011a22',     // Darker shade of tree trunk
  primaryLight: '#023e4f',    // Lighter shade of tree trunk
  primaryAlpha: 'rgba(1, 38, 48, 0.1)',
  
  // Secondary Brand Colors from logo leaves
  secondary: '#D81F62',       // Pink/magenta leaves
  secondaryDark: '#b01950',   // Darker pink
  secondaryLight: '#e13d7a',  // Lighter pink
  secondaryAlpha: 'rgba(216, 31, 98, 0.1)',
  
  // Accent colors from remaining leaves
  accent: '#E6A623',          // Yellow/gold leaves
  accentDark: '#c78a1d',      // Darker gold
  accentLight: '#f0b84c',     // Lighter gold
  accentGreen: '#3A7F3D',     // Green leaves
  accentOlive: '#6A8C38',     // Light green leaves
  
  // Additional brand colors
  brandTeal: '#0097A7',      // Teal leaves & swoosh
  brandMaroon: '#6B1636',    // Deep red/maroon leaves
  
  // Neutral colors - Clean, professional
  white: '#FFFFFF',
  pure: '#FFFFFF',
  black: '#000000',
  gray: '#718096',
  lightGray: '#f1f5f9',
  darkGray: '#2d3748',
  charcoal: '#1a202c',
  
  // Background colors - Warm, professional atmosphere
  background: '#F9F9F9',     // Light background
  backgroundSecondary: '#f7fafc',
  surface: '#FFFFFF',        // Surface elements
  surfaceSecondary: '#edf2f7',
  
  // Status colors using brand palette
  success: '#3A7F3D',        // Success (uses brand green)
  successDark: '#306834',
  warning: '#E6A623',        // Warning (uses brand gold)
  warningDark: '#c78a1d',
  error: '#D81F62',          // Error (uses brand magenta)
  errorDark: '#b01950',
  info: '#0097A7',           // Info (uses brand teal)
  infoDark: '#007a86',
  
  // Text colors - Excellent readability
  textPrimary: '#012630',    // Primary text (matches brand)
  textSecondary: '#58656D',  // Secondary text
  textLight: '#8D979E',      // Tertiary text
  textMuted: '#A0AEC0',      // Muted text
  textOnPrimary: '#ffffff',  // Text on primary backgrounds
  
  // Service-specific themes aligned with Life Changing Journey's offerings
  mental_wellness: {
    primary: '#0097A7',      // Teal for mental wellness
    light: '#e3f8fa',
    background: 'rgba(0, 151, 167, 0.08)',
    text: '#00545e'
  },
  
  mentalWellness: {
    primary: '#0097A7',      // Teal for mental wellness
    light: '#e3f8fa',
    background: 'rgba(0, 151, 167, 0.08)',
    text: '#00545e'
  },
  
  spiritual_growth: {
    primary: '#E6A623',      // Gold for spiritual growth
    light: '#fdf6e8', 
    background: 'rgba(230, 166, 35, 0.08)',
    text: '#7c5914'
  },
  
  spiritualGrowth: {
    primary: '#E6A623',      // Gold for spiritual growth
    light: '#fdf6e8', 
    background: 'rgba(230, 166, 35, 0.08)',
    text: '#7c5914'
  },
  
  financial_guidance: {
    primary: '#3A7F3D',      // Green for financial guidance
    light: '#e8f2e8',
    background: 'rgba(58, 127, 61, 0.08)', 
    text: '#1f441f'
  },
  
  financialGuidance: {
    primary: '#3A7F3D',      // Green for financial guidance
    light: '#e8f2e8',
    background: 'rgba(58, 127, 61, 0.08)', 
    text: '#1f441f'
  },
  
  psychology: {
    primary: '#6B1636',      // Maroon for psychology
    light: '#f8e8ec',
    background: 'rgba(107, 22, 54, 0.08)',
    text: '#4a0e25'
  },
  
  hypnotherapy: {
    primary: '#D81F62',      // Pink for hypnotherapy
    light: '#fce8ee',
    background: 'rgba(216, 31, 98, 0.08)',
    text: '#8d1441'
  },
  
  // Life Changing Journey branded gradients
  gradients: {
    primary: ['#012630', '#023e4f'],             // Tree trunk teal gradient
    secondary: ['#D81F62', '#e13d7a'],           // Pink/magenta leaves gradient
    spiritual: ['#E6A623', '#f0b84c'],           // Gold/spiritual gradient
    wellness: ['#0097A7', '#00b3c7'],            // Teal/mental wellness gradient
    financial: ['#3A7F3D', '#4a9e4d'],           // Green/financial gradient
    psychology: ['#6B1636', '#8d1441'],          // Maroon/psychology gradient
    hypnotherapy: ['#D81F62', '#e13d7a'],        // Pink/hypno gradient
    journey: ['#012630', '#0097A7', '#E6A623'],  // Complete journey
    transformation: ['#6B1636', '#012630', '#3A7F3D'], // Life transformation
    multicolor: ['#012630', '#D81F62', '#E6A623', '#3A7F3D'], // Full brand spectrum
  },
  
  // Professional shadow system
  shadow: {
    light: 'rgba(1, 38, 48, 0.05)',
    medium: 'rgba(1, 38, 48, 0.1)',
    strong: 'rgba(1, 38, 48, 0.15)',
    primary: 'rgba(1, 38, 48, 0.2)',
  }
}

// Life Changing Journey Theme configuration
export const Theme = {
  light: {
    background: Colors.background,
    surface: Colors.surface,
    primary: Colors.primary,
    secondary: Colors.secondary,
    accent: Colors.accent,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    border: Colors.lightGray,
  },
  dark: {
    background: '#011a22',
    surface: '#012630',
    primary: Colors.primaryLight,
    secondary: Colors.secondaryLight,
    accent: Colors.accentLight,
    text: Colors.white,
    textSecondary: Colors.lightGray,
    border: Colors.darkGray,
  }
}
