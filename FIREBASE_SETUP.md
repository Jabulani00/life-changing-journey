# Firebase Setup for Life Changing Journey

The app uses **Firebase Firestore** for:

- **Bookings** – saved when users confirm on the Booking screen
- **Contacts** – contact form submissions
- **Events** – posted by admins (Admin → Post new event)
- **Admin role** – document in `config/admins`

**Collections are created automatically** when the first document is added (you do not create them by hand). The app uses the **life-changing-journey** Firebase project by default.

---

## If events don’t post / “No events yet” / permission errors

**Cause:** Firestore is blocking writes because **security rules** deny unauthenticated or all writes.

**Fix:**

1. Open [Firebase Console](https://console.firebase.google.com/) → select project **life-changing-journey**.
2. Go to **Build** → **Firestore Database** → **Rules**.
3. Either:
   - **Quick (dev only):** choose **Start in test mode** if you just created the database (allows read/write for 30 days), or
   - **Paste rules:** replace the rules with the contents of the **firestore.rules** file in this project (they allow read/write on `events`, `bookings`, `config`, `contacts` for development).
4. Click **Publish**. Then in the app, try posting an event again.

After rules allow write, “Post event” will succeed and **Recent events** will list the new event.

---

## If nothing is saved / no collections appear

Do these in order:

### 1. Install the Firebase package

```bash
npm install firebase
```

If you see **"Unable to resolve module firebase/app"**, the package is missing. Run the command above, then restart: `npx expo start`.

### 2. Enable Firestore in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Select the project **life-changing-journey** (or the project whose ID matches your app config in `src/services/firebaseConfig.js`).
3. In the left menu, click **Build** → **Firestore Database**.
4. If you see **"Create database"**, click it:
   - Choose **Start in test mode** (allows read/write for 30 days for development).
   - Pick a location (e.g. `europe-west1`) and confirm.
5. When Firestore is enabled, you’ll see an empty **"Data"** tab. Collections will appear there after the app writes data.

### 3. Set Firestore rules so the app can write

If posting events still fails, go to Firestore → **Rules** and use the rules from **firestore.rules** in this repo (or keep test mode), then **Publish**. See the section above.

### 4. Restart the app

Stop the dev server (Ctrl+C) and run again:

```bash
npx expo start
```

Then post an event from Admin. Check Firestore → **Data**; you should see the **events** collection and the new document.

---

## 1. Firebase Console (detailed)

1. Go to [Firebase Console](https://console.firebase.google.com/) and select the project **life-changing-journey** (or the project matching your `projectId` in `src/services/firebaseConfig.js`).
2. Enable **Firestore Database** (Create database → Start in test mode for development; lock down rules before production).

## 3. Firestore collections

The app uses these collections:

| Collection | Purpose |
|------------|--------|
| `bookings` | Each document: `userId`, `userEmail`, `serviceId`, `serviceTitle`, `date`, `time`, `status`, `createdAt` |
| `events`   | Each document: `title`, `description`, `date`, `location`, `createdAt` |
| `config`   | Holds admin list (see below) |

No need to create collections manually; they are created when the first document is added.

## 4. Admin access

To let a user act as **admin** (post events, view all bookings):

1. In Firestore, create a document:
   - **Collection:** `config`
   - **Document ID:** `admins`
2. Add a field:
   - **Field:** `emails`
   - **Type:** array
   - **Value:** add strings like `admin@lifechangingjourney.co.za` (one per admin email)

Only users whose **login email** is in this array will see the Admin entry and can post events and view all bookings.

## 5. Optional: environment variables

To avoid committing API keys, you can use Expo env vars and reference them in `src/services/firebase.js`:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

The app still works with the default config in code if these are not set.

## 6. Firestore security rules (recommended for production)

Example rules that allow:

- Anyone to read `events`
- Authenticated users to create/read their own `bookings`
- Only admins to create/update/delete `events` and read all `bookings` (admin check would require custom claims or a separate auth check; the app currently enforces admin in the client and by restricting the Admin UI to admin users).

For a simple start you can use test mode; tighten rules before going live.
