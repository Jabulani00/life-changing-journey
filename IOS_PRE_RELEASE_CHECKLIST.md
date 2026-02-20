# iOS Pre-Release Checklist

Use this checklist before submitting your app to the App Store.

## ✅ Configuration Files

- [x] `app.json` configured with iOS settings
- [x] Bundle identifier set: `com.lifechangingjourney.app`
- [x] Version number set: `1.0.0`
- [x] Build number set: `1`
- [x] Minimum iOS version: `13.4`
- [x] `eas.json` created for EAS builds

## ✅ App Assets

- [ ] App icon (1024x1024px) at `./assets/images/icon.png`
- [ ] Splash screen image at `./assets/images/splash-icon.png`
- [ ] App Store screenshots prepared:
  - [ ] iPhone 6.7" (1290 x 2796) - Required
  - [ ] iPhone 6.5" (1284 x 2778)
  - [ ] iPhone 5.5" (1242 x 2208)
  - [ ] iPad Pro 12.9" (2048 x 2732)

## ✅ Permissions & Privacy

- [x] Phone usage description added
- [x] Camera usage description added (if used)
- [x] Photo library usage description added (if used)
- [x] Location usage description added (if used)
- [ ] Privacy policy URL ready (required for App Store)

## ✅ URL Schemes

- [x] `tel:` scheme configured for phone calls
- [x] `mailto:` scheme configured for email
- [x] `sms:` scheme configured for text messages
- [x] `whatsapp:` scheme configured for WhatsApp
- [x] `https:` / `http:` schemes configured

## ✅ Code Verification

- [x] All `Linking.openURL()` calls use proper URL schemes
- [x] Error handling for failed URL opens
- [x] Platform-specific code checked (iOS compatible)
- [x] No hardcoded Android-specific code

## ✅ App Store Connect Setup

- [ ] Apple Developer account active
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.lifechangingjourney.app`
- [ ] App information completed:
  - [ ] Name: Life Changing Journey
  - [ ] Category selected
  - [ ] Description written
  - [ ] Keywords added
  - [ ] Support URL provided
  - [ ] Privacy Policy URL provided (REQUIRED)

## ✅ Testing

- [ ] Test on physical iOS device
- [ ] Test phone call functionality (`tel:` links)
- [ ] Test WhatsApp links
- [ ] Test email links (`mailto:`)
- [ ] Test all navigation flows
- [ ] Test on different iOS versions (13.4+)
- [ ] Test on iPhone and iPad
- [ ] Test in portrait orientation
- [ ] Test network connectivity handling
- [ ] Test error scenarios

## ✅ Build & Submit

- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into Expo: `eas login`
- [ ] Production build created: `eas build --platform ios --profile production`
- [ ] Build tested successfully
- [ ] App submitted: `eas submit --platform ios --latest`
- [ ] Export compliance answered (usesNonExemptEncryption: false)

## ✅ Post-Submission

- [ ] App Store Connect metadata complete
- [ ] Screenshots uploaded
- [ ] App description finalized
- [ ] "Submit for Review" clicked
- [ ] Review status monitored

## Important Notes

### Before First Build:
1. Update `eas.json` with your actual Apple ID and Team ID
2. Ensure you have an active Apple Developer Program membership
3. Create the app in App Store Connect first

### Before Each Submission:
1. Increment build number in `app.json`
2. Test the new build thoroughly
3. Update "What's New" in App Store Connect

### Common Issues:
- **Missing Privacy Policy**: App Store requires a privacy policy URL
- **Incomplete Metadata**: All required fields must be filled
- **Wrong Bundle ID**: Must match exactly between app.json and App Store Connect
- **Missing Screenshots**: At least one screenshot per device size is required

## Quick Commands Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS (production)
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## Current Configuration

- **Bundle ID**: `com.lifechangingjourney.app`
- **Version**: `1.0.0`
- **Build Number**: `1`
- **Minimum iOS**: `13.4`
- **Supports Tablet**: Yes
- **Encryption**: Non-exempt (usesNonExemptEncryption: false)

---

**Status**: ✅ Ready for iOS build and submission

**Next Steps**: 
1. Update `eas.json` with your Apple credentials
2. Create app in App Store Connect
3. Build production version
4. Submit for review

