# Apple App Review Analysis — Life Changing Journey

**Document version:** 1.0  
**Date:** 29 June 2026  
**App:** Life Changing Journey (Expo iOS, `com.lifechangingjourney.app`)  
**Perspective:** Simulated App Store Review (Guidelines 2.1, 2.3.8, 3.1.1, 4.2.2, 4.8, 5.1.1)

---

## Reviewer verdict

| Field | Assessment |
|-------|------------|
| **Outcome** | **Conditional — resubmit after P0 fixes verified** |
| **Prior rejection** | Build 11 — Guideline **4.2.2** (minimum functionality) |
| **Confidence** | High on 3.1.1 and 2.1; Medium on 4.2.2 |

### Summary

The app has improved since Build 11: native booking, mood check-in, Events RSVP, Motivations save/share, terms gate, privacy links, and in-app account deletion UI. Remaining rejection risks were **free membership upgrades without payment**, **broken Connect-tab navigation**, **external web purchase for digital entitlements with in-app prices**, and **undeployed `deleteAccount` Cloud Function**.

Code changes in this repo address P0 payment/navigation issues. **You must still deploy Firebase Functions, create a demo reviewer account, verify hosted legal URLs, and submit a new EAS build before App Store review.**

---

## Guideline-by-guideline analysis

### 5.1.1 — Privacy / account deletion

| Check | Status |
|-------|--------|
| Privacy policy in app | Pass — Profile, Register, Terms gate |
| In-app account deletion | Pass UI — Profile → Delete account |
| Deletion backend | **Deploy required** — `firebase deploy --only functions` |
| Retention disclosed | Pass — alert + `docs/TERMS_AND_POLICIES.md` §12 |
| Privacy manifest | Partial — email, name, phone, user ID, DOB declared in `app.json` |

### 3.1.1 — In-app purchase / payments

| Issue | Status after fixes |
|-------|-------------------|
| Free plan select without payment | **Fixed** — `SubscriptionScreen` read-only |
| Upgrade modal → free upgrade | **Fixed** — routes to `MembershipPackages` |
| Default Silver without payment | **Fixed** — entitlements from `user_memberships` only |
| iOS in-app ZAR prices + web buy | **Mitigated** — iOS hides prices/purchase CTAs on membership screen |

**Note:** Membership is still purchased on the website. Position the app as a **client portal** for consultation services in App Review notes. If rejected on 3.1.1, implement StoreKit or External Purchase Link entitlement.

### 4.2.2 — Minimum functionality

**Strengths:** Mood check-in, native booking, RSVP, contact form, chatbot, My Bookings.  
**Risks:** Services/Connect/Live tabs still link externally. **Require sign-in** in review notes with demo account.

### 2.1 — Completeness / crashes

| Issue | Status |
|-------|--------|
| Bookmarks/Downloads unregistered routes | **Fixed** — replaced with My Bookings / Motivations |
| SubscriptionProvider missing | **Fixed** — `App.js` |
| Delete account not deployed | **Action required** — deploy functions |

### 2.3.8 — Metadata / assets

| Issue | Action |
|-------|--------|
| Splash asset | Use branded logo (`app.json` updated) |
| Conflicting ASC copy | Use client-portal description only |
| Demo account placeholders | See `docs/APP_REVIEW_DEMO_ACCOUNT.md` |

### 1.4.1 — Health / wellness

Disclaimers added on mood check-in and chat screens. Terms gate covers crisis/emergency.

### 4.8 — Sign in with Apple

**Pass** — email/password only.

### Push notifications

iOS push entitlement stripped via `plugins/withoutPushEntitlement.js`. **Do not claim push** in review notes until APNs is configured.

---

## P0 checklist (must complete before submit)

- [ ] `firebase deploy --only functions` — deploy `deleteAccount`
- [ ] Device test: Profile → Delete account (throwaway account)
- [ ] Create demo reviewer account — see `docs/APP_REVIEW_DEMO_ACCOUNT.md`
- [ ] EAS production iOS build (increment build number)
- [ ] Verify `https://www.lifechangingjourney.co.za/legal/terms-and-policies` is live
- [ ] App Store Connect: Privacy Policy URL, support URL, demo credentials in Review Notes

## P1 checklist

- [ ] Screenshots: signed-in Home (mood), Book, Events RSVP, Profile, Membership status
- [ ] App Privacy questionnaire matches Firebase, bookings, web payments
- [ ] Unified App Store description (client portal — no “no login required”)
- [ ] Confirm `EXPO_PUBLIC_CALENDLY_EMBED_URL` is **not** set in production EAS profile (native booking)

## P2 checklist

- [ ] Tighten Firestore rules for production
- [ ] Configure APNs or stop iOS notification permission prompts
- [ ] Add crash reporting (Sentry/Crashlytics)

---

## Pre-submit test script

1. Fresh install → accept Terms → sign in with **demo account** (not throwaway).
2. Home → tap a mood chip → confirm saved message.
3. Book tab → complete booking (service, date, time) → success screen.
4. Events → RSVP toggle on an event.
5. Motivations → Save + Share a card.
6. Home → Profile → open Privacy Policy link (loads in browser).
7. **Separate throwaway account:** Profile → Delete account → password → confirm account removed.
8. Connect tab → tap My Bookings / Saved Words (no crash).
9. Membership → confirm no free tier upgrade; iOS shows status without purchase buttons.

---

## App Review Notes (copy into App Store Connect)

```
This is a client portal for registered members of Life Changing Journey.

DEMO ACCOUNT (required — sign in to review):
Email: reviewer@lifechangingjourney.co.za
Password: [set before submit — see docs/APP_REVIEW_DEMO_ACCOUNT.md]

REVIEW STEPS:
1. Sign in with the demo account above.
2. Home → Daily Wellness Check-in (tap a mood).
3. Book tab → complete an in-app booking (service, date, time).
4. Events → RSVP on an event.
5. Motivations → save or share a card.
6. Home → Profile → Privacy Policy; account deletion is Profile → Delete account (use a separate test account — do not delete the demo account).

MEMBERSHIP: Active membership is purchased on our website. The iOS app displays plan status and entitlements only. No in-app purchase.

NOT IN THIS BUILD: Push notifications (disabled on iOS). Donate tab is hidden.

Support: info@lifechangingjourney.co.za | https://www.lifechangingjourney.co.za
Privacy: https://www.lifechangingjourney.co.za/legal/terms-and-policies
```

---

## File reference (fixes applied)

| Area | Files |
|------|-------|
| Account deletion | `functions/index.js`, `src/screens/auth/ProfileScreen.js` |
| Payments / entitlements | `src/context/SubscriptionContext.js`, `src/screens/SubscriptionScreen.jsx`, `src/components/subscription/UpgradePromptModal.js`, `src/components/membership/MembershipPackagesScreen.js` |
| Navigation | `src/screens/main/ResourcesScreen.js` |
| Disclaimers | `src/screens/main/HomeScreen.js`, `src/screens/main/ChatbotScreen.js` |
| Providers | `App.js` |
| Metadata | `APP_STORE_CONNECT_SUBMISSION_GUIDE.md`, `app.json` |

---

*© Life Changing Journey Organisation — internal submission document*
