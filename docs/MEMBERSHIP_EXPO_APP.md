# Membership in the Expo app — progress & gaps

This document describes what was implemented to align the **Life Changing Journey** mobile app (Expo) with the **membership web** app and shared **Firestore** data, and what remains optional or incomplete.

For the **Next.js membership web** (`membership-web/`), see `membership-web/MEMBERSHIP_WEB_STATUS.md`.

For **production readiness, terms acceptance, push notifications, and store config**, see [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md).

---

## What was implemented

### 1. Shared data model

- **Collection:** `user_memberships/{uid}` — same document ID as Firebase Auth (`uid`), matching `membership-web/src/lib/store.ts`.
- **Entitlements logic:** Duplicated in JavaScript for the app (`mapPlanToEntitlements`) and kept aligned with `membership-web/src/lib/entitlements.ts` (Silver / Gold / Platinum feature flags).

### 2. Firestore service (`src/services/membershipService.js`)

- **`getMembership(userId)`** — one-shot read of `user_memberships/{uid}`.
- **`subscribeMembership(userId, onData, onError)`** — real-time listener so the UI updates when the web or Stripe webhook updates membership.
- **`getEffectivePlanId(membership)`** — treats plan as inactive if `status !== "active"` or **`endAt`** is in the past (client-side expiry check).
- **`ENTITLEMENT_LABELS`** — human-readable labels for entitlement keys (dashboard-style).

### 3. Firebase module (`src/services/firebase.real.js`)

- **`COLLECTIONS.USER_MEMBERSHIPS`** — constant `'user_memberships'` for consistent paths.

### 4. Firestore security rules (`firestore.rules`)

- **`user_memberships/{userId}`:** authenticated users may **read** only their own document (`request.auth.uid == userId`); **writes** are denied from the client (membership writes stay on the server via Admin SDK / webhooks).

### 5. Package copy & pricing (`src/data/membershipPackages.js`)

- Silver / Gold / Platinum **once-off ZAR** pricing and **marketing benefit bullets**, aligned with `membership-web/src/lib/plans.ts`.

### 6. UI (`src/components/membership/MembershipPackagesScreen.js`)

- Uses existing **theme** (`Colors`, `Typography`).
- **Member type** selector (Children / Adults / Couples) to show the correct tier price.
- **“Your membership”** block: shows Firestore-backed tier, validity, and **active app entitlements** when the user is signed in with a real Firebase account (not demo admin).
- **Guest / demo admin** messaging: explains signing in with the same account as the web.
- **Primary CTA:** opens **`{PUBLIC_SITE_URL}/plans`** for purchase or upgrade (hosted checkout remains on the web).
- **Disclaimer** text (guidance only; not medical advice; financial services).
- **`Constants.PUBLIC_SITE_URL`** — defaults to **`https://www.lifechangingjourney.co.za`** in all builds. Override only with **`EXPO_PUBLIC_LCJ_WEB_URL`** (e.g. LAN IP when testing local `membership-web`).

### 7. Navigation & discovery

- **`MainNavigator`** — stack screen **`MembershipPackages`** (`Membership` header).
- **`HomeScreen`** — quick action tile **Membership** (ribbon icon).

---

## What you must do (operational)

| Task | Why |
|------|-----|
| **Deploy Firestore rules** (`firebase deploy --only firestore:rules` or copy rules into Firebase Console) | Without the `user_memberships` rule, client reads will fail or fall back to errors. |
| Set **`EXPO_PUBLIC_LCJ_WEB_URL`** only when testing against local `membership-web` | Production and EAS builds already use `https://www.lifechangingjourney.co.za` via `eas.json`. |

---

## What is still missing / optional

### Product & UX

- **In-app payment** — not implemented; checkout is intentionally **web** (Stripe) per `membership-web`.
- **Dedicated success/cancel screens** after returning from Stripe in a browser — not in the Expo app (web may handle this).
- **Deep link** from email or web back into the app — not configured.

### Feature gating in the app

- Entitlements are **displayed** on the membership screen but **not yet wired** into other flows (e.g. booking priority, content library, reminders). To use them app-wide:
  - Subscribe to `user_memberships` or call `getEffectivePlanId` + `mapPlanToEntitlements` where needed (e.g. `BookingScreen`, `ResourcesScreen`).
  - Decide business rules (e.g. what “priority booking” means in the app vs. staff workflow).

### Backend / parity

- **Transactions** (`transactions` collection) — not surfaced in the Expo app (web dashboard may show activity).
- **Server-side expiry** — if membership should auto-expire in Firestore, that is a **backend/scheduled job** concern; the app only hides entitlements after `endAt` on the client.

### Testing & quality

- **E2E tests** — signup on web → payment → webhook → open app and verify tier (not automated here).
- **Firestore rules** for `motivations` and other collections may still be looser than production requirements; see `firestore.rules` holistically before go-live.

---

## File reference

| Area | Path |
|------|------|
| Membership UI | `src/components/membership/MembershipPackagesScreen.js` |
| Firestore + entitlements | `src/services/membershipService.js` |
| Package copy | `src/data/membershipPackages.js` |
| Web plans (source of truth for API) | `membership-web/src/lib/plans.ts` |
| Web entitlements | `membership-web/src/lib/entitlements.ts` |
| Public site URL | `src/utils/constants.js` (`PUBLIC_SITE_URL`) — defaults to `https://www.lifechangingjourney.co.za`. Override with **`EXPO_PUBLIC_LCJ_WEB_URL`** only for local dev. |
| Rules | `firestore.rules` |
| Navigator | `src/navigation/MainNavigator.js` |
| Home entry | `src/screens/main/HomeScreen.js` |

---

## Troubleshooting

- **`Unable to resolve module … MembershipPackagesScreen`**  
  The screen lives at `src/components/membership/MembershipPackagesScreen.js` and is imported from `src/navigation/MainNavigator.js` **without** a `.js` suffix (same style as other screens). Do not put `.js` in the import path — Metro can mis-resolve it. Then clear Metro’s cache and restart: `npx expo start -c`

---

*Last updated to reflect Expo membership integration: Firestore read/subscribe, themed packages screen, web checkout CTA, and `user_memberships` client read rules.*
