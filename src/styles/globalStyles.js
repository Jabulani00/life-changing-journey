// Global styles and common styling utilities
import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from './colors'
import { Typography } from './typography'

const { width, height } = Dimensions.get('window')

export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Padding and margin utilities
  padding: {
    padding: 16,
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
  
  margin: {
    margin: 16,
  },
  
  marginHorizontal: {
    marginHorizontal: 16,
  },
  
  marginVertical: {
    marginVertical: 16,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  
  // Button styles
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: Typography.fontSize.md,
    backgroundColor: Colors.surface,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  // Text styles
  title: {
    fontSize: Typography.fontSize.title,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  bodyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.relaxed,
  },
  
  // Header styles
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  
  // Service category colors
  mentalWellnessCard: {
    backgroundColor: Colors.mentalWellness.primary,
  },
  
  spiritualGrowthCard: {
    backgroundColor: Colors.spiritualGrowth.primary,
  },
  
  financialGuidanceCard: {
    backgroundColor: Colors.financialGuidance.primary,
  },
  
  hypnotherapyCard: {
    backgroundColor: Colors.hypnotherapy.primary,
  },
  
  // Utility styles
  shadow: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 16,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  fullHeight: {
    height: '100%',
  },
})

// Screen dimensions
export const ScreenDimensions = {
  width,
  height,
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 414,
  isLargeScreen: width >= 414,
}
