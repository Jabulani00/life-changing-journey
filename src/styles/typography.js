// Fixed Typography System - Life Changing Journey
// Addresses text stretching and readability issues

export const Typography = {
  // Font sizes - Optimized for mobile readability
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    heading1: 32,
    heading2: 28,
    heading3: 24,
    heading4: 20,
    display: 40,
    caption: 12,
    tiny: 10,
  },
  
  // Font weights - Compatible with system fonts
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  
  // Line heights - Fixed for proper text display
  lineHeight: {
    tight: 16,
    snug: 18,
    normal: 20,
    relaxed: 24,
    loose: 28,
    extraLoose: 32,
  },
  
  // Letter spacing - Minimal to prevent stretching
  letterSpacing: {
    tighter: -0.2,
    tight: -0.1,
    normal: 0,
    wide: 0.1,
    wider: 0.2,
    widest: 0.3,
  },
  
  // Font families - Using default system fonts for reliability
  fontFamily: {
    primary: undefined, // Use React Native default
    secondary: undefined, // Use React Native default
    monospace: 'monospace',
  },
  
  // Semantic text styles - Fixed for proper rendering
  textStyles: {
    // Display styles - Fixed sizing
    display: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: 0,
      fontFamily: undefined, // Use system default
    },
    
    // Heading styles - Fixed sizing
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    h5: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    h6: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    
    // Body text styles - Fixed sizing
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 26,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 24,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    
    // UI text styles - Fixed sizing
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    
    // Support text styles - Fixed sizing
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    captionBold: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    overline: {
      fontSize: 10,
      fontWeight: '600',
      lineHeight: 14,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      fontFamily: undefined,
    },
    
    // Special styles - Fixed sizing
    quote: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontStyle: 'italic',
      letterSpacing: 0,
      fontFamily: undefined,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    input: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
      fontFamily: undefined,
    },
    link: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      textDecorationLine: 'underline',
      letterSpacing: 0,
      fontFamily: undefined,
    },
    
    // Wellness-specific styles - Fixed sizing
    meditation: {
      fontSize: 18,
      fontWeight: '300',
      lineHeight: 28,
      letterSpacing: 0.2,
      fontFamily: undefined,
    },
    inspiration: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontStyle: 'italic',
      textAlign: 'center',
      letterSpacing: 0,
      fontFamily: undefined,
    },
    mantra: {
      fontSize: 20,
      fontWeight: '300',
      lineHeight: 28,
      letterSpacing: 0.3,
      textAlign: 'center',
      fontFamily: undefined,
    },
  }
}
