# Life Changing Journey – Requirements to Implementation Mapping

This document maps the **User Stories & Feature Requirements** to the current codebase and lists **gaps** and **suggested implementation order**.

For a full record of recent production work (terms gate, URLs, store config, push notifications), see [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md).

---

## 0. Authentication & Role-Based Access (User / Admin Logins)

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: Login and see user app (home, bookings, events, etc.) | ⚠️ **Partial** | App is user-side; auth may exist (e.g. Supabase) but role-based routing unclear |
| Admin: Login with admin credentials | ❌ **Missing** | No dedicated admin login or role check |
| Admin: See admin-only navigation (separate from user app) | ❌ **Missing** | AdminScreen may exist but no dedicated admin shell/navigation |
| Admin: Access admin dashboard after login | ❌ **Missing** | No admin dashboard as entry point; admin needs own layout |
| User: Cannot access admin routes | ❌ **Missing** | No role guard; admin routes must be protected |

**Gaps to implement**
- **Auth**: Ensure login screen supports both **user** and **admin** (e.g. same form with role from backend, or separate admin login URL/flow). Store role in session/token (e.g. `user.role === 'admin'`).
- **Routing**: After login, **user** → existing user app (tabs: Home, Bookings, Events, etc.). **Admin** → separate admin flow: Admin Dashboard (own navigation) with links to Events, Bookings, Motivations, Chatbot config, etc. No mixing of user tabs and admin screens in one nav.
- **Admin shell**: Implement **admin-only** navigation and dashboard (e.g. `AdminDashboard`, `AdminNav` or drawer/tabs for: Dashboard, Events, Bookings, Motivations, Live Stream, FAQs). App is already the user side; admin gets a distinct entry and layout.
- **Guards**: Protect admin routes so only users with `role === 'admin'` can open admin dashboard/navigation; redirect others to user app or 404.

---

## 1. Feature 1: Book Consultation System

| User Story | Status | Where in Code |
|------------|--------|----------------|
| Select consultation type | ✅ Done | `BookingScreen.js` – `ServiceSelectionStep`, `staticData.services` |
| Select available date and time slot | ✅ Done | `BookingScreen.js` – `DateTimeSelectionStep`, `availableDates`, `availableTimes` |
| Add notes before confirming | ⚠️ **Missing** | No `notes` field in form or in `createBooking()` payload |
| Receive confirmation after booking | ✅ Done | `handleBooking()` – Alert + navigate |
| View upcoming consultations | ✅ Done | `MyBookingsScreen.js` + `getBookings(userId)` |

**Gaps to implement**
- Add optional **notes** field in booking flow (step 2 or 3) and persist via `createBooking({ ...data, notes })`.
- Ensure Firebase `bookings` document supports `notes` (firebase.real.js already spreads `data`, so just add to UI).

---

## 2. Feature 2: Consultation Tracking System

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: See status of consultation | ✅ Done | `MyBookingsScreen` shows `b.status` |
| User: View consultation history | ✅ Done | Same screen lists all user bookings |
| Admin: Track consultation progress | ⚠️ **Partial** | Admin sees list but cannot change status |
| Admin: View past/upcoming, reports | ⚠️ **Partial** | List only; no filter by status/date, no reports |

**Gaps to implement**
- **Firebase**: Add `updateBooking(bookingId, { status?, date?, time? })` in `firebase.real.js` (and stub).
- **AdminScreen**: For each booking, add actions: Approve | Reschedule | Cancel, and call `updateBooking`. Optionally filter by status (pending/approved/completed/cancelled) and by date range.

---

## 3. Feature 3: Events Posting & Management

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: View upcoming events | ✅ Done | `EventsScreen.js` – `getEvents()` |
| User: View full event details | ✅ Done | Title, date, description, location in cards |
| User: Notifications when new event posted | ✅ Done | `expo-notifications` – `notifyNewEvent()` on admin post; tap opens `Events` |
| User: Reminder before event date | ❌ **Missing** | No scheduled local/remote reminder (e.g. 1 day before) |
| Admin: Create and publish events | ✅ Done | `AdminScreen` – Post event form, `addEvent()` |
| Admin: Edit or delete events | ❌ **Missing** | No `updateEvent` / `deleteEvent` in Firebase or UI |
| Admin: Upload event posters/images | ❌ **Missing** | No image field or storage (e.g. Firebase Storage) |

**Gaps to implement**
- **Firebase**: `updateEvent(id, data)`, `deleteEvent(id)`; optional `imageUrl` and Firebase Storage upload helper.
- **AdminScreen**: Edit/delete buttons per event; optional image picker and upload.
- **EventsScreen**: Show image when `event.imageUrl` exists.
- **Notifications**: Optional scheduled reminder before event date (push on create is done).

---

## 4. Feature 4: Daily Motivations / Quotes (Daily Word)

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: See daily motivational quotes | ✅ Done | `MotivationsScreen.js` – feed from Firestore; `HomeScreen` quick action “Daily Word” |
| User: Browse previous motivation posts | ✅ Done | `MotivationsScreen.js` – `getMotivations()`, category filters |
| User: Push when new daily word posted | ✅ Done | `notifyNewDailyWord()` on admin post; tap opens `Motivations` |
| User: Save favorite quotes | ❌ **Missing** | No favorites storage or UI |
| Admin: Post daily motivations | ✅ Done | `AdminScreen` Motivations tab – `addMotivation()` |
| Admin: Edit / delete / schedule posts | ❌ **Missing** | Create only; no update/delete/schedule |

**Gaps to implement**
- **Firebase**: `updateMotivation()`, `deleteMotivation()`; optional `scheduledFor`.
- **App**: Favorites – e.g. `user_favorite_quotes` or AsyncStorage; “Save” on quote card.
- **AdminScreen**: Edit/delete per motivation; optional schedule date.

---

## 5. Feature 5: YouTube + Facebook Live Streaming

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: Open YouTube Live link | ✅ Done | `LiveScreen.js` – opens URL via `Linking` |
| User: Open Facebook Live link | ✅ Done | `LiveScreen.js` – opens URL via `Linking` |
| User: In-app embed (WebView) | ❌ **Missing** | Link-out only; no embed |
| User: Push when admin saves live links | ✅ Done | `notifyLiveStreamUpdated()` on admin save; tap opens `Live` |
| Admin: Post live stream links | ✅ Done | `AdminScreen` Live tab – `setLiveStreamConfig()` → `config/liveStream` |
| Admin: “Active” flag / stream priority | ❌ **Missing** | URLs only; no `isActive` or scheduled go-live |

**Gaps to implement**
- **App**: Optional WebView/embed for in-app viewing.
- **AdminScreen**: “Go live” toggle or scheduled time; optional auto-detect from platform APIs.

---

## 6. Feature 6: AI Chatbot Assistant

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: Ask questions, instant answers | ❌ **Missing** | No chatbot UI or backend |
| User: Chatbot guides through app | ❌ **Missing** | No navigation hints from bot |
| User: Help find consultations and events | ❌ **Missing** | No bot logic |
| Admin: Configure chatbot responses | ❌ **Missing** | No FAQ/config storage or UI |
| Admin: Update FAQs easily | ❌ **Missing** | No FAQ CRUD |

**Gaps to implement**
- **Firebase**: Collection `faqs` (question, answer, order) and/or `chatbot_config` (welcome message, fallback).
- **App**: Chat screen – message list + input; match user text to FAQs (simple keyword match or small AI API); optional “Open Bookings”, “Open Events” quick replies.
- **AdminScreen**: “Chatbot” or “FAQs” tab – add/edit/delete FAQs and optional config.

---

## 7. System-Level & Non-Functional

| Requirement | Status | Notes |
|-------------|--------|--------|
| First-install terms acceptance | ✅ Done | `TermsAcceptanceScreen`, `termsService.js` — see IMPLEMENTATION_SUMMARY.md |
| Production store config (iOS/Android/Huawei) | ✅ Done | `app.json`, `eas.json` production profiles |
| Canonical site URL | ✅ Done | `https://www.lifechangingjourney.co.za` |
| Push notifications (expo-notifications) | ✅ Done | Daily Word, Events, Live — see IMPLEMENTATION_SUMMARY.md |
| App loads fast | ✅ Addressed | Lazy Firebase init, static data fallback |
| Secure handling of data | ⚠️ Partial | Firebase Auth; Firestore rules still open on several collections |
| Clean admin dashboard | ⚠️ Partial | `AdminScreen` + `AdminDashboardScreen`; tabs for events, bookings, motivations, live |
| Scalable architecture | ✅ Addressed | Firebase/Supabase, separation of concerns |

**Non-functional**
- Performance: OK; consider virtualization for long lists.
- Clean UI/UX: Existing screens use `Colors`, `Typography`; can polish per screen.
- Animations: Some (e.g. AnimatedScreen, SwipeWrapper); can add micro-interactions.
- Real-time updates: Not used yet; could add Firestore listeners for bookings/events.
- Error handling: Basic try/catch and alerts; can add global error boundary and user-friendly messages.
- Offline fallback: Partial (static data); consider caching Firebase reads.

---

## 8. Suggested Implementation Order

1. **Authentication & role-based access** (Section 0) – user and admin logins; admin-only navigation and dashboard so admin has their own entry and layout (app stays user-side for regular users). **Do this first** so admin and user see correct pages after login.
2. **Booking notes + Admin booking actions** (Features 1 & 2) – small, high impact.
3. **Events: edit/delete** (Feature 3) – no new collection; extend existing.
4. ~~**Daily motivations backend + screen + admin** (Feature 4)~~ — Done; add favorites/edit/delete.
5. **Events: edit/delete + images** (Feature 3) – polish; push on create is done.
6. ~~**Live streaming screen + config** (Feature 5)~~ — Done; add in-app embed if desired.
7. **AI Chatbot** (Feature 6) – FAQs + chat UI.

---

## 9. Success Criteria Checklist

- [ ] All features from user stories document are implemented or explicitly deferred.
- [ ] **Auth**: User and admin can log in; each sees the correct experience (user → user app, admin → admin dashboard and admin-only navigation).
- [ ] **Admin**: Admin has their own navigation and dashboard (separate from user app); admin routes are protected by role.
- [ ] Booking supports notes; admin can approve/reschedule/cancel.
- [ ] Events: edit, delete; optional images. (Create + push on create: done.)
- [ ] Motivations: favorites; admin edit/delete/schedule. (Feed + admin post + push: done.)
- [ ] Live: in-app embed optional. (Link-out + admin config + push: done.)
- [x] Terms acceptance on first install.
- [x] Push notifications for new event, daily word, and live links.
- [ ] Chatbot: FAQs and in-app help; admin config.
- [ ] UI feels modern, premium, inspiring.
- [ ] System is scalable (Firebase/Supabase used consistently).

---

*This file is the technical build reference derived from the User Stories & Feature Requirements document. For FRS, Technical Architecture, Database Schema, or Timeline, see separate deliverables or request them.*
