import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigateFromNotification(screen, params) {
  if (!navigationRef.isReady() || !screen) return
  navigationRef.navigate(screen, params)
}
