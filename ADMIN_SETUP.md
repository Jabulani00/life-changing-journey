# Admin setup – Life Changing Journey

Admins can post events, manage bookings, set live stream links, and (when implemented) manage motivations and chatbot. Admin status is determined by **email**: if the signed-in user’s email is in the admin list, they see the Admin area.

---

## Default admin login

A default admin account is built in so you can sign in without configuring Firestore or env:

| Email | Password |
|-------|----------|
| `life.changing@admin.com` | `Password@??` |

**You must create this user in Supabase first:** Supabase → Authentication → Users → Add user (or use Sign Up in the app once with this email and password). After that, signing in with this email will open the **Admin Dashboard** (admin-only navigation). The app always treats `life.changing@admin.com` as admin even if Firestore `config/admins` is not set.

---

## Option A: Default admin via environment (quick)

Use this for a first-time or single admin without touching Firebase.

1. Create or edit `.env` in the project root.
2. Add (use your real admin email):
   ```env
   EXPO_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com
   ```
   For multiple admins, separate with commas:
   ```env
   EXPO_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,coach@yourdomain.com
   ```
3. Restart the app. Any user who signs in with one of these emails will have admin access.

**Note:** The user must still **register and sign in** via the normal Login/Register flow (Supabase). There is no separate “admin password”; you use the same account, and the app treats you as admin because your email is in the list.

---

## Option B: Admin list in Firebase (recommended for production)

For production, store admin emails in Firestore so you can change them without rebuilding the app.

1. Open [Firebase Console](https://console.firebase.google.com) → your project → **Firestore Database**.
2. Create or use the **config** collection.
3. Add (or edit) a document with ID **admins** (not a random ID).
4. Add a field:
   - **Field name:** `emails`
   - **Type:** array
   - **Values:** add strings, e.g. `admin@yourdomain.com`, `coach@yourdomain.com`
5. Save. Users who sign in with any of these emails will see the Admin section.

If **config/admins** exists and has at least one email, the app uses only this list (it does not merge with `EXPO_PUBLIC_ADMIN_EMAILS`). If **config/admins** is missing or its `emails` array is empty, the app falls back to `EXPO_PUBLIC_ADMIN_EMAILS`.

---

## Creating the first admin user

1. **Enable auth** (default): ensure `EXPO_PUBLIC_ENABLE_AUTH` is not `false`. See **HOW_TO_LOGIN.md**.
2. **Register** in the app: open the app → Sign Up → enter full name, email, and password → create account.
3. **Sign in** with that email and password.
4. **Add that email to the admin list** using either:
   - **Option A:** put it in `EXPO_PUBLIC_ADMIN_EMAILS` in `.env`, or  
   - **Option B:** add it to the `emails` array in Firestore **config/admins**.
5. Restart the app (or sign out and sign in again). You should see the **Admin** quick action on Home and be able to open the Admin screen.

---

## Summary

| Goal                         | Action |
|-----------------------------|--------|
| First-time default admin    | Set `EXPO_PUBLIC_ADMIN_EMAILS=your@email.com` in `.env`, then register and sign in with that email. |
| Multiple default admins     | `EXPO_PUBLIC_ADMIN_EMAILS=admin@a.com,admin@b.com` in `.env`. |
| Production admin list       | In Firestore, create **config** → document **admins** → field **emails** (array of email strings). |
| No separate “admin login”   | Admins use the same Register/Login as everyone else; admin rights come from their email being in the list. |
