# How to log in – Life Changing Journey

**Users can browse the app without logging in.** The app opens straight into the main tabs (Home, Services, Booking, Live, etc.) as a guest. Signing in is optional and gives access to My Bookings, profile, and (for admins) the Admin area.

---

## Browsing without login (default)

By default, no login is required. Open the app and you’ll see the main content. You can explore services, events, live links, and contact options. To use **My Bookings** or **Admin**, sign in from the Profile/account entry point when you choose to.

---

## If you want to sign in

1. Use the app’s entry to **Sign in** (e.g. from Profile or a “Sign in” prompt where it’s offered).
2. Enter your **email** and **password**, then tap **Sign In**.
3. If you don’t have an account, tap **Sign Up**, create an account, then sign in.

**Other options:**

- **Forgot Password?** – Use this to reset your password (requires Supabase email to be configured).
- **Sign Up** – Create an account (full name, email, password) to join the community and use My Bookings, etc.

---

## Optional: require login to use the app

If you want to **force** users to sign in before they can use the app (login screen first):

1. Create a `.env` file in the project root (or set environment variables for Expo).
2. Add:
   ```env
   EXPO_PUBLIC_ENABLE_AUTH=true
   ```
3. Configure **Supabase**: set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`, and enable Email auth in the Supabase dashboard.
4. Restart the app. The login screen will appear first; after sign-in, users see the main app.

---

## Summary

| What you want              | What to do |
|----------------------------|------------|
| Browse without logging in  | **Default** – just open the app. No sign-in required. |
| Sign in (optional)         | Use **Sign In** from the app (e.g. Profile) with your email and password. |
| Create an account          | Tap **Sign Up**, fill the form, then sign in. |
| Admin access               | Default admin: **life.changing@admin.com** / **Password@??** (create this user in Supabase first). See **ADMIN_SETUP.md**. |
| Require login for everyone | Set `EXPO_PUBLIC_ENABLE_AUTH=true` in `.env` and restart. |
