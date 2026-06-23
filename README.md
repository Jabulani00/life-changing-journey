# Life Changing Journey

Expo mobile app for **Life Changing Journey** — holistic wellness services, bookings, membership, daily motivations, events, live streams, and an AI assistant.

**Website:** [https://www.lifechangingjourney.co.za](https://www.lifechangingjourney.co.za)

## Stack

- **Expo SDK 54** / React Native
- **React Navigation** (`src/navigation/`) — not expo-router
- **Firebase** Auth + Firestore
- **EAS Build** for iOS, Google Play, and Huawei App Gallery

## Get started

```bash
npm install
npx expo start
```

For a clean Metro cache:

```bash
npx expo start -c
```

Open on a physical device or emulator. Push notifications require a **physical device** and a native dev or EAS build.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/RELEASE_HISTORY.md](docs/RELEASE_HISTORY.md) | **Store builds** — iOS, Play Store, Huawei APKs, submit status, TestFlight copy |
| [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | **Master reference** — terms gate, URLs, store config, auth, push notifications |
| [docs/MEMBERSHIP_EXPO_APP.md](docs/MEMBERSHIP_EXPO_APP.md) | Membership tiers, Firestore sync, web checkout |
| [FIREBASE_SETUP.md](FIREBASE_SETUP.md) | Firebase project and Firestore setup |
| [ADMIN_SETUP.md](ADMIN_SETUP.md) | Admin accounts and Admin screen |
| [IOS_RELEASE_GUIDE.md](IOS_RELEASE_GUIDE.md) | iOS App Store release |
| [IOS_PRE_RELEASE_CHECKLIST.md](IOS_PRE_RELEASE_CHECKLIST.md) | Pre-submission checklist |
| [REQUIREMENTS_MAPPING.md](REQUIREMENTS_MAPPING.md) | User stories vs implementation status |
| [membership-web/MEMBERSHIP_WEB_STATUS.md](membership-web/MEMBERSHIP_WEB_STATUS.md) | Next.js membership portal |

## Production builds

```bash
# iOS / Google Play
eas build --platform all --profile production

# Huawei App Gallery (APK)
eas build --platform android --profile production-huawei
```

Deploy Firestore rules before go-live:

```bash
firebase deploy --only firestore:rules
```

## Key features

- First-install **terms & policies** acceptance
- **Membership** status synced from Firestore / membership web
- **Push notifications** when admin posts Daily Word, events, or live links
- **Admin** panel for events, bookings, motivations, and live stream URLs

## Project structure

```
src/
  navigation/     App, auth, main, and tab navigators
  screens/        UI screens (main, auth, admin, legal, services)
  services/       Firebase, push notifications, membership, admin
  context/        AuthProvider
  hooks/          usePushNotifications
  data/           Terms, membership packages
docs/             Implementation and membership docs
membership-web/   Next.js membership purchase portal
```

## Environment

Copy `.env.example` if present, or set:

- `EXPO_PUBLIC_FIREBASE_*` — Firebase config
- `EXPO_PUBLIC_LCJ_WEB_URL` — optional; defaults to production site
- `EXPO_PUBLIC_GEMINI_API_KEY` — optional; AI chatbot

Production EAS profile sets `EXPO_PUBLIC_ENV=production` and `EXPO_PUBLIC_LCJ_WEB_URL=https://www.lifechangingjourney.co.za` automatically (see `eas.json`).
