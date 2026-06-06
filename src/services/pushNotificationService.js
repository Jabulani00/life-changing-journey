import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import {
  getAllPushTokens,
  removePushToken,
  savePushToken,
} from './firebase'
import { Constants as AppConstants } from '../utils/constants'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

/** Show alerts, sound, and badge when a notification arrives in the foreground. */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}

function sanitizeTokenDocId(token) {
  return String(token).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 150)
}

/**
 * Request permissions and return an Expo push token (physical device only).
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') return null
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.')
    return null
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Life Changing Journey',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#012630',
    })
  }

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return null

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId

  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  )
  return tokenResponse.data
}

/**
 * Persist device push token in Firestore for broadcast notifications.
 */
export async function registerAndStorePushToken(userId) {
  try {
    const token = await registerForPushNotificationsAsync()
    if (!token) return null
    const docId = sanitizeTokenDocId(token)
    await savePushToken(docId, {
      expoPushToken: token,
      userId: userId || 'guest',
      platform: Platform.OS,
    })
    return token
  } catch (e) {
    console.warn('Push token registration failed:', e?.message || e)
    return null
  }
}

async function sendExpoPushBatch(messages) {
  if (!messages.length) return { sent: 0, errors: [] }
  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result?.errors?.[0]?.message || 'Push send failed')
  }
  return result
}

/**
 * Send a push notification to every registered device token.
 */
export async function broadcastPushNotification({ title, body, data = {} }) {
  const tokens = await getAllPushTokens()
  const unique = [...new Set(tokens.map((t) => t.expoPushToken).filter(Boolean))]
  if (!unique.length) {
    console.warn('No push tokens registered — users must open the app on a device first.')
    return { sent: 0, skipped: true }
  }

  const messages = unique.map((to) => ({
    to,
    sound: 'default',
    title,
    body,
    data,
    channelId: Platform.OS === 'android' ? 'default' : undefined,
  }))

  const chunkSize = 100
  let sent = 0
  const staleTokens = []

  for (let i = 0; i < messages.length; i += chunkSize) {
    const chunk = messages.slice(i, i + chunkSize)
    const result = await sendExpoPushBatch(chunk)
    const tickets = Array.isArray(result?.data) ? result.data : []
    tickets.forEach((ticket, idx) => {
      if (ticket?.status === 'ok') {
        sent += 1
      } else if (ticket?.details?.error === 'DeviceNotRegistered') {
        const badToken = chunk[idx]?.to
        if (badToken) staleTokens.push(sanitizeTokenDocId(badToken))
      }
    })
  }

  await Promise.all(staleTokens.map((id) => removePushToken(id).catch(() => {})))
  return { sent, total: unique.length }
}

export async function notifyNewEvent({ title, description }) {
  const eventTitle = title?.trim() || 'New event'
  const body =
    (description && String(description).trim().slice(0, 120)) ||
    'A new event has been posted. Tap to view details.'
  return broadcastPushNotification({
    title: `New Event: ${eventTitle}`,
    body,
    data: {
      type: AppConstants.NOTIFICATION_TYPES.EVENT,
      screen: 'Events',
    },
  })
}

export async function notifyNewDailyWord({ message, category }) {
  const preview = (message && String(message).trim().slice(0, 140)) || 'Your daily word is ready.'
  const catLabel = category ? String(category).charAt(0).toUpperCase() + String(category).slice(1) : 'Daily'
  return broadcastPushNotification({
    title: `${catLabel} Word of the Day`,
    body: preview,
    data: {
      type: AppConstants.NOTIFICATION_TYPES.DAILY_WORD,
      screen: 'Motivations',
    },
  })
}

export async function notifyLiveStreamUpdated({ youtubeUrl, facebookUrl }) {
  const platforms = []
  if (youtubeUrl) platforms.push('YouTube')
  if (facebookUrl) platforms.push('Facebook')
  const platformText = platforms.length ? platforms.join(' & ') : 'our channels'
  return broadcastPushNotification({
    title: 'We are live!',
    body: `Join us now on ${platformText}. Tap to watch.`,
    data: {
      type: AppConstants.NOTIFICATION_TYPES.LIVE,
      screen: 'Live',
    },
  })
}

export function getNotificationScreen(data) {
  const screen = data?.screen
  if (screen === 'Events' || screen === 'Motivations' || screen === 'Live') return screen
  const type = data?.type
  if (type === AppConstants.NOTIFICATION_TYPES.EVENT) return 'Events'
  if (type === AppConstants.NOTIFICATION_TYPES.DAILY_WORD) return 'Motivations'
  if (type === AppConstants.NOTIFICATION_TYPES.LIVE) return 'Live'
  return null
}
