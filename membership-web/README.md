# Membership Web App

This folder contains the standalone web app used to purchase Life Changing Journey memberships.

It intentionally uses a **mock payment adapter** so a separate payment developer can plug in Stripe/Paystack later without rewriting core flows.

## Features included

- Firebase email/password auth on web login page
- Secure server session via verified Firebase ID token cookie
- Plans API (Silver/Gold/Platinum pricing + benefits)
- Purchase flow using `POST /api/checkout/start`
- Mock payment provider with configurable outcome
- Membership dashboard
- `GET /api/me/entitlements` endpoint for mobile app consumption
- Firebase Firestore persistence for memberships and transactions

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `.env.local` in this folder if needed:

```bash
MOCK_PAYMENT_OUTCOME=success
NEXT_PUBLIC_PAYMENT_MODE=mock
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

`MOCK_PAYMENT_OUTCOME` supports: `success`, `pending`, `failed`.

If Firebase vars are not set, defaults from the main app config are used.
For secure server-side token verification, set the Firebase Admin credentials (`FIREBASE_*`) using a service account.

## API summary

- `POST /api/auth/login` body: `{ "email": "you@example.com" }`
- `POST /api/auth/session` body: `{ "idToken": "<firebase-id-token>" }`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/plans`
- `POST /api/checkout/start` body: `{ "planId": "gold", "memberType": "adults" }`
- `GET /api/me/entitlements`

`POST /api/auth/login` is deprecated.

## Payment integration handoff

Replace `src/lib/payments/mock-provider.ts` with a real gateway implementation that conforms to:

- `createCheckoutSession(input)`
- `verifyPayment(sessionId)`

The rest of the checkout and entitlement flow can remain unchanged.
