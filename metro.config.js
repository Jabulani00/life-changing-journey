// Metro bundler configuration
// Explicitly prevents Expo Router from being auto-detected
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure .js files are resolved before .ts files for better compatibility
// This fixes issues with Supabase and other packages that use .js files
const originalSourceExts = config.resolver.sourceExts;
config.resolver.sourceExts = [
  ...originalSourceExts.filter(ext => ext !== 'js' && ext !== 'ts'),
  'js',  // Prioritize .js files
  'jsx',
  'json',
  'ts',
  'tsx',
];

// Disable Expo Router by ensuring no app directory is detected
config.watchFolders = config.watchFolders || [];
config.watchFolders = config.watchFolders.filter(folder => !folder.includes('app'));

module.exports = config;

