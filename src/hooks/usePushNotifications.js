import * as Notifications from 'expo-notifications'
import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { navigateFromNotification } from '../navigation/navigationRef'
import {
  getNotificationScreen,
  registerAndStorePushToken,
} from '../services/pushNotificationService'

/**
 * Registers push token and handles notification taps → navigate to Events / Motivations / Live.
 */
export function usePushNotifications(enabled = true) {
  const { user } = useAuth()
  const responseListener = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const userId = user?.uid || user?.id || 'guest'
    registerAndStorePushToken(userId)

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response?.notification?.request?.content?.data
      const screen = getNotificationScreen(data)
      if (screen) navigateFromNotification(screen)
    })

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return
      const data = response?.notification?.request?.content?.data
      const screen = getNotificationScreen(data)
      if (screen) navigateFromNotification(screen)
    })

    return () => {
      responseListener.current?.remove?.()
    }
  }, [enabled, user?.uid, user?.id])
}
