# iOS App Release Guide - Life Changing Journey

This guide will help you prepare and submit your app to the Apple App Store.

## Prerequisites

1. **Apple Developer Account**: You need an active Apple Developer Program membership ($99/year)
2. **Xcode**: Install Xcode from the Mac App Store (latest version recommended)
3. **Expo CLI**: Ensure you have the latest Expo CLI installed
4. **EAS Build**: Install EAS CLI for building iOS apps

## Step 1: Install Required Tools

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure EAS for your project
eas build:configure
```

## Step 2: Configure App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with your Apple Developer account
3. Click "My Apps" → "+" → "New App"
4. Fill in the app information:
   - **Platform**: iOS
   - **Name**: Life Changing Journey
   - **Primary Language**: English
   - **Bundle ID**: com.lifechangingjourney.app (must match app.json)
   - **SKU**: life-changing-journey-ios (unique identifier)
   - **User Access**: Full Access

## Step 3: Update App Configuration

### Update Version Numbers

Before building, update version numbers in `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",  // Update for each release
    "ios": {
      "buildNumber": "1"  // Increment for each build
    }
  }
}
```

### Verify Bundle Identifier

Ensure the bundle identifier matches your App Store Connect app:
- Current: `com.lifechangingjourney.app`
- Must match exactly in App Store Connect

## Step 4: Prepare App Icons and Screenshots

### Required Icon Sizes

iOS requires multiple icon sizes. Ensure you have:
- 1024x1024px icon (App Store)
- 180x180px icon (iPhone)
- 167x167px icon (iPad Pro)
- 152x152px icon (iPad)
- 120x120px icon (iPhone)

Your icon should be at: `./assets/images/icon.png`

### App Store Screenshots Required

You'll need screenshots for:
- iPhone 6.7" Display (1290 x 2796 pixels) - Required
- iPhone 6.5" Display (1284 x 2778 pixels)
- iPhone 5.5" Display (1242 x 2208 pixels)
- iPad Pro 12.9" Display (2048 x 2732 pixels)

**Minimum**: 1 screenshot per device size
**Recommended**: 3-5 screenshots per device size

## Step 5: Build the iOS App

### Development Build (for testing)

```bash
# Build for iOS simulator
eas build --platform ios --profile development

# Build for physical device
eas build --platform ios --profile development --local
```

### Production Build (for App Store)

```bash
# Build for App Store submission
eas build --platform ios --profile production
```

### Using EAS Build Profiles

Create `eas.json` in your project root:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.lifechangingjourney.app"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

## Step 6: Test the Build

1. Download the build from EAS Build dashboard
2. Install on a physical iOS device using TestFlight or direct install
3. Test all features:
   - Phone calls (tel: links)
   - WhatsApp links
   - Email links
   - Navigation
   - All screens and features

## Step 7: Submit to App Store

### Option A: Using EAS Submit (Recommended)

```bash
# Submit the latest production build
eas submit --platform ios --latest
```

### Option B: Manual Submission via Xcode

1. Download the `.ipa` file from EAS Build
2. Open Xcode → Window → Organizer
3. Click "Distribute App"
4. Select "App Store Connect"
5. Follow the prompts to upload

### Option C: Using Transporter App

1. Download Transporter from Mac App Store
2. Open Transporter
3. Drag and drop your `.ipa` file
4. Click "Deliver"

## Step 8: Complete App Store Listing

In App Store Connect, complete:

1. **App Information**:
   - Category: Health & Fitness / Lifestyle
   - Subtitle: Your gateway to wellness transformation
   - Privacy Policy URL: (required)

2. **Pricing and Availability**:
   - Price: Free (or set your price)
   - Availability: All countries (or select specific)

3. **App Privacy**:
   - Answer privacy questions about data collection
   - Current permissions:
     - Phone calls (for contacting services)
     - Camera (optional, for profile photos)
     - Photo Library (optional, for profile photos)
     - Location (optional, for nearby services)

4. **Version Information**:
   - What's New in This Version
   - Keywords (comma-separated)
   - Support URL
   - Marketing URL (optional)

5. **App Review Information**:
   - Contact Information
   - Demo Account (if login required)
   - Notes (explain any special features)

## Step 9: Submit for Review

1. Click "Submit for Review" in App Store Connect
2. Answer export compliance questions:
   - Uses encryption: Yes
   - Uses non-exempt encryption: No (already set in app.json)
3. Wait for review (typically 24-48 hours)

## Step 10: Post-Submission

### Common Rejection Reasons

- Missing privacy policy URL
- Incomplete app description
- Missing screenshots
- App crashes during review
- Missing required permissions descriptions

### If Rejected

1. Read the rejection reason carefully
2. Fix the issue
3. Update version/build number
4. Rebuild and resubmit

## Important Notes

### Bundle Identifier
- Current: `com.lifechangingjourney.app`
- Cannot be changed after first submission
- Must be unique across App Store

### Version Numbering
- Version format: `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- Build number increments with each build
- Version increments with each App Store release

### Permissions
The app requests these permissions (already configured):
- Phone calls (for tel: links)
- Camera (optional)
- Photo Library (optional)
- Location (optional)

### URL Schemes
Configured to support:
- `tel:` - Phone calls
- `mailto:` - Email
- `sms:` - Text messages
- `whatsapp:` - WhatsApp
- `https:` / `http:` - Web links

## Troubleshooting

### Build Fails
- Check bundle identifier matches App Store Connect
- Verify certificates and provisioning profiles
- Check for missing dependencies

### Submission Fails
- Verify app is built with correct configuration
- Check that version/build number is incremented
- Ensure all required metadata is complete

### App Rejected
- Review rejection reason
- Test app thoroughly before resubmission
- Ensure privacy policy is accessible

## Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)

## Next Steps After Approval

1. Monitor app performance in App Store Connect
2. Respond to user reviews
3. Plan updates and feature releases
4. Monitor crash reports and analytics

---

**Current Configuration Summary:**
- Bundle ID: `com.lifechangingjourney.app`
- Version: `1.0.0`
- Build Number: `1`
- Minimum iOS: `13.4`
- Supports iPad: Yes
- Supports iPhone: Yes

Good luck with your iOS release! 🚀

