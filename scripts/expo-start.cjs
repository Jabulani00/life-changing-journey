/**
 * Start Expo with response caching disabled.
 * Avoids "Body is unusable: Body has already been read" when Expo CLI
 * fetches native module versions (undici / Node 20+ cache bug).
 */
if (!process.env.EXPO_NO_CACHE) {
  process.env.EXPO_NO_CACHE = '1'
}

require('expo/bin/cli')
