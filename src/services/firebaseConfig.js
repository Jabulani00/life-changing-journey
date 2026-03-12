/**
 * Firebase config for Life Changing Journey.
 * Used by firebase.real.js when Firebase is installed.
 * Safe for Metro/bundler (process may be undefined).
 * Override any value with EXPO_PUBLIC_FIREBASE_* env vars if needed.
 */
const env = typeof process !== 'undefined' && process.env ? process.env : {}

export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBaIU4LZ7M-8iP_cHc3VMYq3diHA9p5Q0o',
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'life-changing-journey.firebaseapp.com',
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'life-changing-journey',
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'life-changing-journey.firebasestorage.app',
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '718431951358',
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:718431951358:web:a5c55d4e4d5464e4ab48af',
  measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-9GHE4C34YH',
}
