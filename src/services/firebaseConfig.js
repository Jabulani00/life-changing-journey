/**
 * Firebase config for Life Changing Journey (chrono-scan project).
 * Used by firebase.real.js when Firebase is installed.
 * Safe for Metro/bundler (process may be undefined).
 */
const env = typeof process !== 'undefined' && process.env ? process.env : {}
export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzTJcpZASSot-tAgBCOwWl9rvnyvh5mF8',
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'chrono-scan.firebaseapp.com',
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chrono-scan',
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'chrono-scan.firebasestorage.app',
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '218618224396',
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:218618224396:web:4d5eeacaaad37a56513329',
}
