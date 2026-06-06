# Codebase baseline (subscription work)

Summary of how the app works **before** subscription gating, for maintainers.

## Auth

- **`AuthProvider`** (`src/context/AuthContext.js`): Firebase Auth (`subscribeToAuthState`) + optional Supabase if `EXPO_PUBLIC_ENABLE_AUTH` and Supabase configured.
- **User shape in app**: `{ id, uid, email, user_metadata }` from `getUserProfileFromFirestore` on sign-in (Firestore `users/{uid}`).
- **Demo admin**: special user id `demo-admin` via AsyncStorage (no Firebase).
- **Guest**: `signInAsGuest` sets `isAnonymous: true` (not used in default `AppNavigator` branch which requires `user` truthy).

## Navigation

- **`AppNavigator`**: If `user` → `MainNavigator` + `ChatbotFAB`; else `AuthNavigator` (Login, Register, Forgot). **No route-level auth guard** beyond “user exists”.
- **`MainNavigator`**: Stack with `Tabs` (TabNavigator) + modal-style screens (Profile, Contact, Booking-related, **MembershipPackages**, etc.).
- **`TabNavigator`**: Bottom tabs — Home, Services, Booking, Connect (ResourcesScreen).
- **Admin**: Not a separate root; `admin` flag from `isAdmin(email)` + `HomeScreen` link to **Admin** stack screen (`AdminScreen`). `AdminNavigator` exists in codebase but **App.js does not use it**; admin uses `MainNavigator` → Admin screen.

## Membership (pre-gating)

- Firestore **`user_memberships/{uid}`**: written by `membership-web` / Stripe; `planId`, `status`, `endAt`, etc.
- **`membershipService.js`**: `getEffectivePlanId`, `subscribeMembership`, legacy `mapPlanToEntitlements`.

## Bookings

- **`createBooking`** (`firebase.real.js`): `addDoc` to **`bookings`** with `userId`, contact fields, `serviceId`, `date`, `time`, `status: 'pending'`, etc.
- **`BookingScreen`**: 3-step flow; no server-side validation of hours beyond UI (simulated slot availability).
- **`getBookings(userId, asAdmin)`**: user filter or all for admin; sorted by `createdAt` string desc.
- **`adminService`**: `adminGetAllBookings`, `adminUpdateBooking` (status/date/time/notes).

## Other data

- **Events**, **motivations**, **contacts**, **config** (admins, live stream): Firestore per `firebase.real.js`.
- **Supabase**: optional profiles path in `updateProfile` / `getUserProfile` if configured.

## Notifications / reminders

- **No** Expo push pipeline or email queue in-repo. Contact form copy mentions “within 24 hours” only.

## Hooks / providers

- **`useAuth`**: AuthContext.
- **`DataProvider`**: `src/providers/DataProvider.js` (app data if any).
- **`FontLoader`**, **`NetworkProvider`**.

## Admin UI

- **`AdminScreen`**: tabs Events, Bookings, Motivations, Live; loads bookings unsorted by priority (until subscription work adds `priority`).

---

---

## Subscription gating (implemented layers)

- **`src/config/subscriptionConfig.js`** — `PLAN_ID`, discounts, priority scores, `SESSION_LIMITS`, `BOOKING_CATEGORY`, `PLAN_DISPLAY_NAME`.
- **`SubscriptionProvider` + `useSubscription()`** — `src/context/SubscriptionContext.js` (wrapped in `App.js` after `AuthProvider`). Derives tier from `user_memberships` then `users.plan`; mirrors `plan` + `notificationTier` via `mergeUserPlanField`.
- **`src/hooks/useSubscription.js`** — re-exports the hook.
- **Bookings** — `createBooking` stores `plan`, `priority`, discount fields, `bookingCategory`, flags; `getBookings` sorts by `priority` desc then `createdAt`; `countUserMonthBookingsByCategory` enforces monthly caps client-side; `bookingSubscriptionSideEffects` creates `staff_tasks` rows (reminders / follow-up intent — no push pipeline in-repo).
- **UI** — `BookingScreen` (session types, discount summary, upgrade modal, 24h date bypass for Platinum); `ResourcesScreen` (content library + private community gates); `ContactScreen` (`priorityQueue`); `AdminScreen` (priority line); `MembershipPackagesScreen` (horizontal compare + `useSubscription`); `UpgradePromptModal`.
- **Firestore** — `staff_tasks` rules added; `users` gains `plan`, `notificationTier` from client merge.

### Not fully automated (by design / infra)

- **Push / email reminders** — booking sets flags and staff tasks; no FCM/APNs or SendGrid in this repo.
- **Server-side enforcement** of session caps — client checks before write; production should validate in Cloud Functions or strict rules.
- **Dedicated “progress dashboard” screen** — hook exposes `hasProgressTracking`; no new route added (can link from Home later).

*Generated for subscription gating implementation; adjust if navigation or auth changes.*
