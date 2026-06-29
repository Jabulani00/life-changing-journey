# iOS Submission Log — Life Changing Journey

Tracks every App Store build and submission with dates, build numbers, outcomes, and commands used.

---

## Submission History

### Build 33 — SUBMITTED (June 29, 2026)

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Build Number | 33 |
| EAS Build ID | `2eec148d-9d06-421d-8ddd-43a9eac162ae` |
| EAS Submission ID | `4b676595-ea25-47e6-af3f-79dda63fcd3e` |
| Commit | `0d9ff8f` |
| Build Date | June 29, 2026 |
| Status | 🔄 Submitted — processing on App Store Connect |
| Apple Team ID | 4B3H2MM88X |
| Apple ID | lifechangingjourney84@gmail.com |
| ASC App ID | 6755474250 |

**Build Log:** https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/2eec148d-9d06-421d-8ddd-43a9eac162ae  
**IPA Artifact:** https://expo.dev/artifacts/eas/UwHUQyVVgS5rbvPZw40jcn9KwuoQEMAch_DbQGRG4Hs.ipa  
**Submission:** https://expo.dev/accounts/jabumb/projects/life-changing-journey/submissions/4b676595-ea25-47e6-af3f-79dda63fcd3e  
**TestFlight:** https://appstoreconnect.apple.com/apps/6755474250/testflight/ios

**Changes (Apple review remediation — Build 31 code):**
- P0 payments: read-only `SubscriptionScreen`; entitlements from `user_memberships` only; iOS-safe membership UI
- P0 navigation: Connect tab My Bookings / Saved Words (replaces broken Bookmarks/Downloads)
- P0 account deletion: Profile → Delete account (requires `firebase deploy --only functions`)
- P1: Health disclaimers on mood check-in + chat; privacy manifest DOB; branded splash
- `SubscriptionProvider` fix in `App.js`

**Commands used:**

```powershell
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --latest --non-interactive
```

**Note:** `scripts/eas-prompt-patch.cjs` caused early exit during credential setup; use plain `eas` CLI for builds.

**Before selecting build in App Store Connect:**
1. Deploy `deleteAccount` Cloud Function: `firebase deploy --only functions`
2. Create demo account per `docs/APP_REVIEW_DEMO_ACCOUNT.md`
3. Paste review notes from `docs/APPLE_APP_REVIEW_ANALYSIS.md` into App Review Information

---

### Build 11 — REJECTED (June 2026)

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Build Number | 11 |
| Submission ID | a7149b74-36bb-45e8-a648-2e23c7a3b98b |
| Review Date | June 22, 2026 |
| Status | ❌ Rejected |
| Rejection Guideline | 4.2.2 — Minimum Functionality |

**Apple Feedback:**
> The app's main functionality is to market your service, with limited or no user-facing interactive features. Apps that are primarily marketing materials or advertisements are not appropriate for the App Store.

**Root Cause:**
- Home screen showed static service cards with external links only
- No in-app interactive actions visible to the reviewer
- Booking flow required Calendly URL env var (showed error to reviewer)
- Merge conflicts in code (`HomeScreen.js`, `MyBookingsScreen.js`, `firebase.real.js`)

**EAS Build ID:** `28c97a0a-4198-4577-843c-d270b4076ab6`

---

### Build 29 — SUBMITTED (June 23, 2026)

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Build Number | 29 |
| EAS Build ID | `32492fb4-eab8-4c5a-94c5-74a0f5f744c0` |
| EAS Submission ID | `1e66efcf-70bd-4940-b5cb-efa5a9ecc1e9` |
| Commit | `83e96cc` |
| Build Date | June 23, 2026 |
| Status | 🔄 Submitted — In Review |
| Apple Team ID | 4B3H2MM88X |
| Apple ID | lifechangingjourney84@gmail.com |
| ASC App ID | 6755474250 |

**Build Log:** https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/32492fb4-eab8-4c5a-94c5-74a0f5f744c0
**IPA Artifact:** https://expo.dev/artifacts/eas/bAsPAPiFt4JdhOWk2kpoQQx0fZsuofHSKk8geab9sE8.ipa
**Submission:** https://expo.dev/accounts/jabumb/projects/life-changing-journey/submissions/1e66efcf-70bd-4940-b5cb-efa5a9ecc1e9

**Root Causes Fixed (from Build 28 failures):**

Three separate `npm ci` failures on EAS build servers required iterative fixes:

1. **Metro bundle failure (Build 13)** — `react-native-webview` was only a transitive peer dep; added it explicitly as `"react-native-webview": "13.15.0"` in `package.json`.
2. **Push notification prompt blocking non-interactive build** — Added `"promptToConfigurePushNotifications": false` to `eas.json` cli section; also added `eas-prompt-patch.cjs` to auto-answer all EAS prompts.
3. **npm ci peer dep conflict (Builds 25, 28)** — `@firebase/auth` has an optional peer dep on `@react-native-async-storage/async-storage@^1.18.1` but we install v2.x. npm v7 on EAS servers validates this strictly. Fix: created `.npmrc` with `legacy-peer-deps=true` (npm v6 peer dep behaviour — no strict peer dep auto-install). Regenerated `package-lock.json` with the same flag.

**Commits in this build:**
```
83e96cc  fix: add legacy-peer-deps to resolve npm ci peer dep conflict on EAS
253adce  fix: regenerate package-lock.json to resolve npm ci sync error on EAS
7067f0f  fix: disable push notification setup prompt + add react-native-webview
a151023  fix: add react-native-webview dependency to resolve Metro bundle error
fdeed90  fix: resolve merge conflicts and add Apple 4.2.2 interactive features
```

**Commands used:**

```powershell
# Trigger build (non-interactive via patch scripts)
node --require ./scripts/eas-trace.cjs --require ./scripts/eas-prompt-patch.cjs `
  "C:\Users\JABU\AppData\Roaming\npm\node_modules\eas-cli\bin\run" `
  build --platform ios --profile production `
  2>&1 | Tee-Object -FilePath "C:\Users\JABU\Desktop\eas-build-debug2.txt"

# Submit latest build to App Store
node --require ./scripts/eas-prompt-patch.cjs `
  "C:\Users\JABU\AppData\Roaming\npm\node_modules\eas-cli\bin\run" `
  submit --platform ios --latest
```

**Files added/changed for build infrastructure:**
- `.npmrc` — `legacy-peer-deps=true` (fixes npm ci peer dep validation on EAS)
- `package-lock.json` — regenerated clean with legacy-peer-deps
- `package.json` — added `react-native-webview@13.15.0` explicitly
- `eas.json` — added `promptToConfigurePushNotifications: false` in cli section
- `scripts/eas-prompt-patch.cjs` — patches EAS CLI prompts for non-interactive use
- `scripts/eas-trace.cjs` — diagnostic trace for debugging EAS exit points

---

### Build 12 — SUBMITTED (June 23, 2026)

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Build Number | 12 |
| Commit | `fdeed90` |
| Status | 🔄 In Review |
| EAS Account | jabumb / mjgwala2k@gmail.com |
| Apple Team ID | 4B3H2MM88X |
| Apple ID | lifechangingjourney84@gmail.com |

**Changes Made (addressing 4.2.2 rejection):**

1. **Merge conflicts resolved** — `HomeScreen.js`, `MyBookingsScreen.js`, `firebase.real.js`
2. **Daily Wellness Check-in** — Interactive mood tracker on Home (Great/Good/Okay/Low/Stressed), persisted per-day via AsyncStorage
3. **Book Appointment CTA** — Prominent gradient banner on Home screen, always visible, navigates to booking flow
4. **In-App Booking Form** (replaces Calendly-not-configured error):
   - Service selector (pulls from `staticData.services`)
   - 14-day horizontal date picker
   - Time slot grid (08:00–17:00)
   - Optional notes field
   - Saves to Firestore via `createBooking()` — same data model as Calendly bookings
   - Triggers notifications and staff tasks same as Calendly flow
   - Navigates to `BookingSuccessScreen` on completion
5. **RSVP buttons on Events** — Toggle RSVP per event, persisted via AsyncStorage, confirmation alerts
6. **Save & Share on Motivations** — Heart/Save toggle and native Share sheet on each card; "Saved" filter tab
7. **UI polish** — All booking screens use `useSafeAreaInsets()`, 44pt touch targets, consistent gradients

**Commands Run:**

```bash
# 1. Upgrade EAS CLI
npm install -g eas-cli
# Result: eas-cli/20.3.0

# 2. Verify login
eas whoami
# Result: jabumb / mjgwala2k@gmail.com

# 3. Stage resolved conflict files + new changes
git add src/screens/main/HomeScreen.js \
        src/screens/main/MyBookingsScreen.js \
        src/services/firebase.real.js \
        src/screens/BookingScreen.jsx \
        src/screens/main/EventsScreen.js \
        src/screens/main/MotivationsScreen.js

# 4. Commit
git commit -m "fix: resolve merge conflicts and add Apple 4.2.2 interactive features"
# Commit: fdeed90

# 5. Trigger EAS production build (build number auto-incremented to 12 by remote version source)
eas build --platform ios --profile production --non-interactive

# 6. Submit to App Store (run after build finishes)
eas submit --platform ios --latest
```

**EAS Config used (`eas.json`):**
```json
{
  "cli": { "version": ">= 5.9.0", "appVersionSource": "remote" },
  "build": {
    "production": { "env": { "EXPO_PUBLIC_ENV": "production" } }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "lifechangingjourney84@gmail.com",
        "appleTeamId": "4B3H2MM88X"
      }
    }
  }
}
```

**App Store Connect Review Notes used for resubmission:**
```
APP REVIEW NOTES — Resubmission addressing Guideline 4.2.2

We have added the following user-facing interactive features:

1. DAILY WELLNESS CHECK-IN (Home screen)
   Tap any of the 5 mood options (Great/Good/Okay/Low/Stressed).
   Your selection is saved and a link to the AI Wellness Coach appears.

2. IN-APP BOOKING (Book tab / "Book Appointment" banner on Home)
   - Select a service from the list
   - Choose a date from the next 14 days
   - Pick a time slot (08:00–17:00)
   - Add optional notes
   - Tap "Confirm Booking" — saves to our database instantly
   - View confirmation in My Bookings tab

3. EVENT RSVP (Events screen)
   Each event card has an "RSVP for this Event" button.
   Tap to register; tap again to cancel. Shows "RSVP Confirmed" state.

4. MOTIVATIONS — SAVE & SHARE
   Each motivation card has Save (heart) and Share buttons.
   Saved items appear in the "Saved" filter tab.

DEMO ACCOUNT:
Email: [your demo account email]
Password: [your demo account password]

The app is a wellness client portal — not purely informational.
Users can book sessions, track mood, RSVP to events, and save content.
```

---

## App Configuration Reference

| Setting | Value |
|---------|-------|
| Bundle ID | `com.lifechangingjourney.app` |
| Version | `1.0.0` |
| Min iOS | `13.4` |
| Supports iPad | Yes |
| Encryption | `usesNonExemptEncryption: false` |
| EAS Project ID | `bc265066-d7a0-43c1-ae2c-d7d7a013bff8` |

---

## How to Resubmit in Future

```bash
# 1. Make code changes, then commit
git add <files>
git commit -m "your message"

# 2. Build (build number auto-increments)
eas build --platform ios --profile production --non-interactive

# 3. Wait for build to finish, then submit
eas submit --platform ios --latest

# Check build list / status
eas build:list --platform ios --limit 5
```

**Notes:**
- `appVersionSource: "remote"` in `eas.json` means EAS auto-increments build numbers — never edit `buildNumber` in `app.json` manually
- Build takes ~20–30 min on Expo servers; check progress at https://expo.dev
- After `eas submit`, log into App Store Connect and click "Submit for Review"
- Always increment the `version` in `app.json` for a new App Store version (e.g. `1.0.0` → `1.1.0`)

---

## Common Rejection Reasons & Fixes

| Guideline | Issue | Fix |
|-----------|-------|-----|
| 4.2.2 | Minimum functionality | Add interactive features (booking, check-in, RSVP) — DONE in Build 12 |
| 2.3.8 | Placeholder icons | Ensure `assets/icon.png` is final branded 1024×1024 PNG |
| 5.1.1 | Privacy policy missing | Add URL to App Store Connect listing |
| 5.1.1(v) | Account deletion missing | Profile → Delete account (in-app); deploy `deleteAccount` Cloud Function |
| 2.1 | App crashes | Test on device before submitting |

---

*Last updated: June 29, 2026 — Build 33 submitted to App Store Connect*
