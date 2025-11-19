// Script to reset Expo and clear all caches
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Expo caches...');

// Remove .expo folder
const expoDir = path.join(__dirname, '.expo');
if (fs.existsSync(expoDir)) {
  fs.rmSync(expoDir, { recursive: true, force: true });
  console.log('✅ Removed .expo folder');
}

// Remove node_modules cache
const cacheDir = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ Removed node_modules/.cache');
}

console.log('✅ Cache cleared!');
console.log('📱 Now run: npx expo start --clear');


