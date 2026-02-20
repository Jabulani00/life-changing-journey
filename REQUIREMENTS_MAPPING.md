# Life Changing Journey – Requirements to Implementation Mapping

This document maps the **User Stories & Feature Requirements** to the current codebase and lists **gaps** and **suggested implementation order**.

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
| User: Notifications for upcoming events | ❌ **Missing** | No push/local notifications |
| Admin: Create and publish events | ✅ Done | `AdminScreen` – Post event form, `addEvent()` |
| Admin: Edit or delete events | ❌ **Missing** | No `updateEvent` / `deleteEvent` in Firebase or UI |
| Admin: Upload event posters/images | ❌ **Missing** | No image field or storage (e.g. Firebase Storage) |

**Gaps to implement**
- **Firebase**: `updateEvent(id, data)`, `deleteEvent(id)`; optional `imageUrl` and Firebase Storage upload helper.
- **AdminScreen**: Edit/delete buttons per event; optional image picker and upload.
- **EventsScreen**: Show image when `event.imageUrl` exists.
- **Notifications**: Later phase – integrate expo-notifications and trigger for upcoming event (e.g. 1 day before).

---

## 4. Feature 4: Daily Motivations / Quotes

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: See daily motivational quotes | ⚠️ **Partial** | `HomeScreen` has random quote from `staticData.inspirationalQuotes` but not prominent/dedicated |
| User: Browse previous motivation posts | ❌ **Missing** | No dedicated screen or feed from backend |
| User: Save favorite quotes | ❌ **Missing** | No favorites storage or UI |
| Admin: Post daily motivations | ❌ **Missing** | No motivations in Firebase, no admin UI |
| Admin: Schedule / manage old posts | ❌ **Missing** | No schedule or CRUD |

**Gaps to implement**
- **Firebase**: New collection `motivations` (e.g. `text`, `author`, `scheduledFor`, `createdAt`). Optional `order` or “daily” logic (e.g. one per day).
- **Firebase**: `getMotivations()`, `addMotivation()`, `updateMotivation()`, `deleteMotivation()`.
- **App**: “Daily motivation” or “Motivations” screen – list/calendar of motivations; today’s quote prominent.
- **App**: Favorites – e.g. `user_favorite_quotes` (userId + motivationId) or AsyncStorage for anonymous; “Save” on quote card.
- **AdminScreen**: New tab “Motivations” – create, edit, delete, optional schedule date.

---

## 5. Feature 5: YouTube + Facebook Live Streaming

| User Story | Status | Where in Code |
|------------|--------|----------------|
| User: Watch YouTube Live in app | ❌ **Missing** | No embed or WebView |
| User: Watch Facebook Live in app | ❌ **Missing** | No embed or WebView |
| User: Notifications when live starts | ❌ **Missing** | No push/live detection |
| Admin: Post live stream links | ❌ **Missing** | No config for active stream URL(s) |
| Admin: Control which streams are active | ❌ **Missing** | No “active” flag or priority |

**Gaps to implement**
- **Firebase**: Config or collection for “live stream” (e.g. `config/liveStream` or `streams` with `platform`, `url`, `isActive`, `scheduledAt`).
- **App**: “Live” or “Watch” screen – WebView or embed (e.g. react-native-youtube-iframe for YouTube; Facebook may require in-app browser or link-out with fallback).
- **AdminScreen**: Form to set YouTube URL, Facebook URL, and “active” stream; optional “Go live” time for notifications.
- **Notifications**: “Live started” push when admin marks stream active (or integrate with platform APIs if needed).

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
| App loads fast | ✅ Addressed | Lazy Firebase init, static data fallback |
| Secure handling of data | ✅ Addressed | Auth via Supabase; Firebase rules needed for production |
| Clean admin dashboard | ⚠️ Partial | AdminScreen exists; can be refined with tabs and filters |
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

1. **Booking notes + Admin booking actions** (Features 1 & 2) – small, high impact.
2. **Events: edit/delete** (Feature 3) – no new collection; extend existing.
3. **Daily motivations backend + screen + admin** (Feature 4) – new collection and UI.
4. **Events: images + notifications** (Feature 3) – optional polish.
5. **Live streaming** (Feature 5) – new screen + config.
6. **AI Chatbot** (Feature 6) – FAQs + chat UI.

---

## 9. Success Criteria Checklist

- [ ] All features from user stories document are implemented or explicitly deferred.
- [ ] Booking supports notes; admin can approve/reschedule/cancel.
- [ ] Events: create, edit, delete; optional images and notifications.
- [ ] Motivations: daily/browse + favorites; admin CRUD.
- [ ] Live: watch in-app; admin sets links and active stream.
- [ ] Chatbot: FAQs and in-app help; admin config.
- [ ] UI feels modern, premium, inspiring.
- [ ] System is scalable (Firebase/Supabase used consistently).

---

*This file is the technical build reference derived from the User Stories & Feature Requirements document. For FRS, Technical Architecture, Database Schema, or Timeline, see separate deliverables or request them.*
