// Main App Component - Life Changing Journey
import NetInfo from '@react-native-community/netinfo'
import React from 'react'
import { LogBox, Platform, StatusBar } from 'react-native'
import CustomSplashScreen from './src/components/common/CustomSplashScreen'
import NetworkStatusBar from './src/components/common/NetworkStatusBar'
import ErrorBoundary from './src/components/ErrorBoundary'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import { DataProvider } from './src/providers/DataProvider'
import { FontLoader } from './src/providers/FontLoader'
import { NetworkProvider } from './src/utils/networkUtils'

// On web, NetInfo does HEAD requests to the current origin (localhost:8081). Metro often returns
// 500 for HEAD, causing ERR_ABORTED 500. Disable the reachability check on web to stop those requests.
if (Platform.OS === 'web') {
  NetInfo.configure({
    reachabilityShouldRun: () => false,
  })
}

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle:',
  'Blocked aria-hidden',
]);

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true)
  const [fontsReady, setFontsReady] = React.useState(false)

  // Override global styles for web to fix scrolling
  if (Platform.OS === 'web') {
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow: auto !important;
        height: 100% !important;
      }
      #root {
        overflow: auto !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  const [splashAnimationComplete, setSplashAnimationComplete] = React.useState(false)

  // Hide splash when BOTH animation finishes AND fonts are loaded
  const handleSplashComplete = () => {
    setSplashAnimationComplete(true)
  }

  React.useEffect(() => {
    if (splashAnimationComplete && fontsReady) {
      // Both conditions met, splash can be hidden
      setShowSplash(false)
    }
  }, [splashAnimationComplete, fontsReady])

  // Fallback timeout to ensure splash doesn't stay forever
  React.useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      setShowSplash(false)
    }, 8000) // 8 seconds max

    return () => clearTimeout(fallbackTimeout)
  }, [])

  return (
    <ErrorBoundary>
      <NetworkProvider>
        {/* Show Custom Splash Screen outside FontLoader to cover font loading time */}
        {showSplash && (
          <CustomSplashScreen
            onFinish={handleSplashComplete}
            minimumMs={4000}
          />
        )}
        
        <FontLoader onReady={() => setFontsReady(true)}>
          <AuthProvider>
            <DataProvider>
              <NetworkStatusBar />
              <AppNavigator />
              <StatusBar style="auto" />
            </DataProvider>
          </AuthProvider>
        </FontLoader>
      </NetworkProvider>
    </ErrorBoundary>
  )
}
