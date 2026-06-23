import AsyncStorage from '@react-native-async-storage/async-storage'
import { Constants } from '../utils/constants'
import { TERMS_VERSION } from '../data/termsAndPolicies'

const STORAGE_KEY = Constants.STORAGE_KEYS.TERMS_ACCEPTED

export async function hasAcceptedTerms() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return parsed?.version === TERMS_VERSION && parsed?.accepted === true
  } catch {
    return false
  }
}

export async function acceptTerms() {
  const payload = {
    accepted: true,
    version: TERMS_VERSION,
    acceptedAt: new Date().toISOString(),
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

/** Dev/testing only — clears acceptance so the gate shows again. */
export async function clearTermsAcceptance() {
  await AsyncStorage.removeItem(STORAGE_KEY)
}
