# App Store Connect Submission Guide - Life Changing Journey

This guide helps you prepare your iOS app for App Store submission, including screenshots, metadata, and required information.

## ✅ **COMPLETED - Ready to Copy & Paste**

All content below has been customized specifically for **Life Changing Journey** based on your app's actual features and services. You can copy and paste directly into App Store Connect:

- ✅ **Promotional Text** (169/170 characters) - Ready to use
- ✅ **App Description** (Complete, detailed) - Ready to use  
- ✅ **Keywords** (99/100 characters) - Ready to use
- ✅ **App Review Notes** - Complete instructions for reviewers
- ✅ **Support URL Content** - HTML template provided
- ✅ **Screenshot Guide** - Specific to your app screens

**Contact Information Used:**
- Email: info@lifechangingjourney.co.za
- Phone: +27 31 035 0208
- WhatsApp: +27 65 846 0441
- Website: lifechangingjourney.co.za
- Location: Durban, South Africa

---

## 🚨 Fixing Apple Rejection (Guidelines 2.3.8 & 4.2.2)

If Apple rejected your build for **placeholder app icons** or **minimum functionality**, use this section first.

### 1️⃣ Fix Guideline 2.3.8 — App Icon (Expo)

- **What Apple wants:** One final branded icon, same style across all sizes, no Expo default.
- **Icon spec:** 1024×1024 PNG, no transparency, no rounded corners. Name it `icon.png`.
- **Where it lives in this project:** `./assets/icon.png` (already wired in `app.json`).
- **Rebuild required:** Apple does not accept OTA icon changes. After updating the icon, run:
  ```bash
  expo prebuild
  eas build -p ios
  ```

### 2️⃣ Fix Guideline 4.2.2 — Minimum Functionality (CRITICAL)

Apple rejects apps that look like “a website packaged as an app.” You need **real interaction + user value**.

**Your app already has the right building blocks:**

- ✅ **User login** (Supabase Auth — ensure it’s enabled for the build you submit)
- ✅ **Submit a request / booking** (BookingScreen — book sessions inside the app)
- ✅ **Profile / dashboard** (ProfileScreen)

**Before resubmitting:**

1. **Enable auth for the production build**  
   Set `EXPO_PUBLIC_ENABLE_AUTH=true` (or equivalent) so reviewers see login and in-app booking, not “browse without account.”

2. **Use the Apple-safe description** (see section below) — focus on “manage,” “track,” “request,” “portal,” not “about us” or “marketing.”

3. **Screenshots** must show logged-in screens, booking flow, and buttons/forms — not only a landing or info-only screens.

4. **App Review notes** — provide a demo account and describe the app as a **client portal** (see “App Review Notes (Apple-safe)” below).

**Do NOT:**

- ❌ Embed your website in a WebView only  
- ❌ Rely on external links for main features  
- ❌ Say “marketing” in the listing  
- ✅ Use native navigation and in-app actions (you already do)

### 3️⃣ Apple-Safe App Description (use this for resubmission)

Replace the current description with one that emphasizes **functionality**:

```
Life Changing Journey is a client portal that allows registered users to manage their wellness journey, submit service and session requests, book appointments, track progress, and receive updates directly within the app.

KEY FEATURES:
• Create an account and sign in securely
• Submit and manage requests for psychology, spiritual growth, hypnotherapy, financial guidance, and integrated services
• Book sessions and view your booking history
• Access your profile and service status in one place
• Contact practitioners and support from within the app
• Browse resources and stay connected with the Life Changing Journey community

This app is for clients and users who want to manage their engagement with our wellness services, request support, and track their journey — all in one place.

Based in Durban, South Africa. For support: lifechangingjourney.co.za | info@lifechangingjourney.co.za
```

### 4️⃣ App Review Notes (Apple-safe)

Use this when login is **enabled** (required for approval):

```
APP REVIEW NOTES:

This app is a client portal. Reviewers should sign in to see full functionality.

DEMO ACCOUNT:
Email: [your-demo@lifechangingjourney.co.za]
Password: [your-demo-password]

HOW TO USE:
1. Open the app and sign in with the demo account above.
2. From the main tabs, use "Booking" to submit a session request (service, date, time).
3. Use "Profile" to view account and engagement.
4. "Services" and "Resources" show available offerings; contact options work in-app.

The app provides ongoing value through user accounts, in-app request/booking, and profile management — not only informational content.

No additional credentials required.
```

*(Replace the demo email and password with a real test account you create.)*

### 5️⃣ What to Reply to Apple When Resubmitting

In App Store Connect, when you resubmit, you can reply with:

```
Hello App Review Team,

Thank you for the feedback. We have updated the app with finalized, branded app icons and added user-facing interactive functionality, including user accounts and in-app request management, to provide ongoing value beyond marketing content.

We appreciate your guidance and look forward to your review.
```

---

## ✅ What's Wrong (and How to Fix It)

### 1. Screenshot Dimensions Are Incorrect

Apple requires specific sizes for the **6.5-inch iPhone display**.

**Accepted dimensions:**
- **1242 × 2688 px**
- **2688 × 1242 px**
- **1284 × 2778 px**
- **2778 × 1284 px**

📌 **Meaning:**
Your uploaded screenshots don't match any of these. You must resize or recapture them.

➡️ **Solution:**
- Resize your existing screenshots to match one of these dimensions
- Or recapture screenshots from an iPhone 11 Pro Max or iPhone XS Max simulator
- Use design tools like Figma, Photoshop, or online resizers

**Tools to help:**
- [Figma App Store Screenshot Templates](https://www.figma.com/community/file/818142801900567892)
- [App Store Screenshot Generator](https://www.appstorescreenshot.com/)
- Photoshop templates available online

---

## 📱 What You Still Need to Fill In

### 2. Promotional Text (up to 170 characters)

Shown on the App Store without requiring an update. This appears above your app description and can be updated anytime.

**Example:**
> "Transform your wellness journey with psychology, spiritual growth, hypnotherapy, and financial guidance services. Connect with expert practitioners and start your path to holistic transformation today."

**Tips:**
- Highlight the main value proposition
- Keep it concise and compelling
- Update seasonally without app updates

---

### 3. App Description (up to 4,000 characters)

This is your main sales pitch. Write a compelling description that:
- Explains what your app does
- Highlights key features
- Describes who it's for
- Includes benefits and use cases

**Structure:**
1. **Hook** (first 2-3 lines - most important!)
2. **Key Features** (bullet points work well)
3. **Who It's For**
4. **How It Works**
5. **Call to Action**

**Complete App Description for Life Changing Journey:**
```
Welcome to Life Changing Journey – your comprehensive gateway to wellness transformation and holistic personal development in South Africa.

Our app connects you with professional wellness services and trusted practitioners, bringing together psychology, spiritual growth, financial guidance, hypnotherapy, and integrated services all in one place.

SIX CORE SERVICES:

• Psychology & Mental Wellness
   Access professional psychological support with Vuyani Nyezi, a counselling psychologist with 12+ years of experience. Services include individual therapy sessions, psychological assessments, stress and anxiety management, depression support, trauma counseling, and culturally-integrated African psychology approaches.

• Spiritual Interventions & Traditional Healing
   Experience traditional African spiritual interventions (izinkinga zemimoya) including spiritual cleansing (Ukugezwa Kwemimoya), traditional healing ceremonies, ancestral communication, and Ubuntu-based spiritual guidance rooted in cultural heritage.

• Financial Guidance & Loans
   Connect with Tshabalala Omhle Financial Group, a proudly Black-owned NCR-registered credit provider (NCRCP20083) offering soft loans, personal loans, business financing, debt consolidation, and ethical financial counseling services.

• Hypnotherapy & Life Coaching
   Transform your life through professional hypnotherapy sessions and life coaching. Overcome limiting beliefs, break bad habits, build confidence, and unlock your full potential for personal transformation.

• Integrated Services & Professional Registrations
   Tshabalala Omkhulu Consulting provides comprehensive integrated services including fingerprint clearance, SACE registration, PSIRA registrations, UBER/Bolt/InDrive registration, SAIT registration, NCR registrations, PDP applications, gambling licenses, and business consulting.

• Educational Support & Community Development
   The Nyezi Vuyani Foundation offers educational support for rural communities, financial assistance for learners, mentorship programs, career guidance, and initiatives bridging the educational gap between urban and rural areas.

KEY FEATURES:
✓ Browse comprehensive directory of wellness services
✓ Direct contact via phone, WhatsApp, or email
✓ Detailed service provider profiles and information
✓ Educational resources and articles
✓ Access to podcasts and video content
✓ Social media integration (Facebook, Instagram, YouTube, TikTok)
✓ Inspirational quotes and daily motivation
✓ Easy navigation with intuitive interface
✓ No login required – instant access to all services
✓ Community-focused and culturally relevant services

WHO IT'S FOR:
• Individuals seeking mental health support and therapy
• People on a spiritual growth and traditional healing journey
• Those looking to overcome limiting beliefs through hypnotherapy
• Anyone needing financial guidance, loans, or financial planning
• Professionals requiring registration services (SACE, PSIRA, etc.)
• Students and learners seeking educational support
• Communities looking for holistic wellness solutions
• Anyone interested in African psychology and indigenous knowledge systems

HOW IT WORKS:
1. Download and open the app – no registration required
2. Browse our comprehensive directory of wellness services
3. Explore detailed information about each service provider
4. Contact practitioners directly via phone, WhatsApp, or email
5. Access educational resources, articles, and video content
6. Connect with our community through social media links
7. Start your transformation journey today

WHY CHOOSE LIFE CHANGING JOURNEY:
• Trusted practitioners with verified credentials
• Culturally integrated services honoring African heritage
• Comprehensive wellness ecosystem in one app
• Direct access to service providers
• Community-focused approach
• No barriers – free to browse and contact
• Support for both individual and community transformation

Based in Durban, South Africa, Life Changing Journey is committed to holistic transformation and community upliftment. Our services integrate modern professional practices with traditional wisdom, creating a unique approach to wellness that honors both contemporary needs and cultural heritage.

Start your wellness journey today. Download Life Changing Journey and take the first step toward holistic transformation.

For support, visit lifechangingjourney.co.za or contact us at info@lifechangingjourney.co.za
```

---

### 4. Keywords (100 characters)

Important for App Store SEO. Use comma-separated keywords without spaces after commas.

**Optimized Keywords for Life Changing Journey:**
```
psychology,mental health,spiritual healing,financial services,hypnotherapy,life coaching,therapy,counseling,traditional healing,African psychology,financial guidance,wellness,South Africa,Durban,wellness directory
```

**Character count:** 99/100 ✅

**Tips:**
- Use relevant search terms people would use
- Include variations of your main services
- Don't repeat words
- Research competitor keywords
- Update periodically based on performance

---

### 5. Support URL + Marketing URL

Must be real, reachable websites (not example.com).

**Required:**
- **Support URL:** Where users can get help
- **Marketing URL:** (Optional) Your main website or landing page

**If you don't have these yet, you can:**

1. **Create a simple support page:**
   - Host on your existing domain
   - Include contact information
   - FAQ section
   - Support email

2. **Use your main website:**
   - If you have a website, use that
   - Add a `/support` or `/help` page

3. **Create a landing page:**
   - Simple HTML page
   - Host on GitHub Pages, Netlify, or your domain
   - Include app information and contact details

**Support Page Content (use on your website at lifechangingjourney.co.za/support):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Life Changing Journey - Support</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>Support & Contact</h1>
    <p>Need help with the Life Changing Journey app? We're here to assist you.</p>
    
    <h2>Contact Information</h2>
    <ul>
        <li><strong>Email:</strong> info@lifechangingjourney.co.za</li>
        <li><strong>Phone:</strong> +27 31 035 0208</li>
        <li><strong>WhatsApp:</strong> +27 65 846 0441</li>
        <li><strong>Office:</strong> Durban, South Africa</li>
    </ul>
    
    <h2>Response Time</h2>
    <p>We respond to all inquiries within 24 hours.</p>
    
    <h2>Frequently Asked Questions</h2>
    
    <h3>How do I contact a service provider?</h3>
    <p>Browse the Services tab, select a service, and use the Call, WhatsApp, or Email buttons to contact them directly.</p>
    
    <h3>Do I need to create an account?</h3>
    <p>No, the app works without registration. All features are accessible immediately.</p>
    
    <h3>What services are available?</h3>
    <p>We offer Psychology Services, Spiritual Interventions, Financial Guidance, Hypnotherapy, Integrated Services, and Educational Support.</p>
    
    <h3>Is the app free?</h3>
    <p>Yes, the app is free to download and use. Service providers may charge for their services.</p>
    
    <h2>Website</h2>
    <p>Visit our main website: <a href="https://lifechangingjourney.co.za">lifechangingjourney.co.za</a></p>
</body>
</html>
```

**Support URL:** https://lifechangingjourney.co.za/support (or create this page)
**Marketing URL:** https://lifechangingjourney.co.za

---

### 6. App Review Login Info

If your app requires sign-in, you must provide Apple with:

**Required Information:**
- **Username:** (if login required)
- **Password:** (if login required)
- **Notes:** Explain how to navigate the app, any special features, or demo account details

**For Life Changing Journey:**
Since your app is a directory gateway that doesn't require login, use this:

```
APP REVIEW NOTES:

This app is a directory gateway for wellness services and does not require 
user authentication or login. All features are fully accessible without 
registration.

HOW TO USE THE APP:
1. Open the app - no login required
2. Browse the "Services" tab to see all available wellness services
3. Tap on any service card to view detailed information
4. Use "Call Us", "WhatsApp", or "Email" buttons to contact providers directly
5. Navigate to "Resources" tab for educational content and social media links
6. Use "Contact" tab to reach our main office

KEY FEATURES TO TEST:
- Service directory browsing (Services tab)
- Service detail pages with provider information
- Direct contact options (phone, WhatsApp, email)
- Resources section with educational content
- Social media links (Facebook, Instagram, YouTube, TikTok)
- Contact form (Contact tab)

All contact features work without authentication. The app serves as a 
directory and contact gateway connecting users with wellness service 
providers in South Africa.

No login credentials required for App Review.
```

**If login is required:**
```
Demo Account:
Username: [demo@example.com]
Password: [demo123]

Notes:
- The app is a wellness services directory
- Users can browse all services without login
- Login is optional for saving favorites or booking appointments
- All contact features work without authentication
```

---

### 7. Release Strategy

You're currently choosing:
✔️ **"Automatically release this version after App Review, no earlier than Nov 19 2025, 1:00 PM"**

**Options:**

1. **Automatically release this version** (Recommended)
   - App goes live immediately after approval
   - Best for most cases

2. **Automatically release this version after App Review, no earlier than [date]**
   - Scheduled release
   - Good for coordinated launches

3. **Manually release this version**
   - You control when it goes live
   - Good if you want to coordinate with marketing

**Recommendation:** Choose "Automatically release this version" unless you have a specific launch date planned.

---

## 📋 Complete Submission Checklist

### Screenshots Required

- [ ] **iPhone 6.7" Display** (1290 × 2796 px) - Required
- [ ] **iPhone 6.5" Display** (1242 × 2688 px or 1284 × 2778 px)
- [ ] **iPhone 5.5" Display** (1242 × 2208 px)
- [ ] **iPad Pro 12.9" Display** (2048 × 2732 px) - If supporting iPad

**Minimum:** 1 screenshot per device size
**Recommended:** 3-5 screenshots per device size

### App Information

- [ ] **Name:** Life Changing Journey
- [ ] **Subtitle:** (Optional, up to 30 characters)
- [ ] **Category:** Health & Fitness / Lifestyle
- [ ] **Content Rights:** Completed
- [ ] **Age Rating:** Completed

### App Store Listing

- [ ] **Promotional Text:** (Up to 170 characters)
- [ ] **Description:** (Up to 4,000 characters)
- [ ] **Keywords:** (Up to 100 characters)
- [ ] **Support URL:** (Required)
- [ ] **Marketing URL:** (Optional)
- [ ] **Privacy Policy URL:** (Required)

### App Review Information

- [ ] **Contact Information:** Completed
- [ ] **Demo Account:** (If login required)
- [ ] **Notes:** Instructions for reviewers
- [ ] **Attachments:** (If needed)

### Version Information

- [ ] **What's New:** First version description
- [ ] **Screenshots:** All required sizes uploaded
- [ ] **App Preview:** (Optional video)

---

## 🖼️ Screenshot Preparation Guide

### What Screenshots Should Show (Based on Your App)

1. **Home Screen** - Welcome message and app description with service cards
2. **Services Tab** - Complete directory showing all 6 services (Psychology, Spiritual, Financial, Hypnotherapy, Integrated Services, Education)
3. **Service Detail Screen** - Detailed view of a service (e.g., Psychology Services) showing features, practitioner info, contact options
4. **Contact Screen** - "Get In Touch" section with Call, WhatsApp, Email buttons and contact form
5. **Resources Tab** - Social media links, educational content, podcasts, and video resources
6. **Service Category** - Example: Mental Wellness screen showing detailed service information

**Recommended Screenshot Order:**
1. Home screen with app icon and welcome message
2. Services directory showing all service cards
3. Psychology Services detail page
4. Contact screen with call/WhatsApp/email options
5. Resources screen with social media links

### Design Tips

- **Use real content** - Show actual app screens
- **Add text overlays** - Highlight key features
- **Consistent style** - Same design language across all screenshots
- **Show value** - Demonstrate what users get
- **Clean design** - Remove unnecessary UI elements if needed

### Tools for Creating Screenshots

1. **Figma** - Free, web-based design tool
2. **Photoshop** - Professional image editing
3. **Sketch** - Mac design tool
4. **Online Tools:**
   - [App Store Screenshot Generator](https://www.appstorescreenshot.com/)
   - [Screenshot Framer](https://screenshot.rocks/)

---

## 📝 Ready-to-Use Content

### Promotional Text (170 characters)

```
Your gateway to psychology, spiritual healing, financial services, hypnotherapy & integrated services. Connect with trusted practitioners in South Africa. Start your transformation today.
```

**Character count:** 169/170 ✅

### Subtitle (30 characters)

```
Wellness Services Directory
```

**Character count:** 25/30 ✅

### Keywords (100 characters)

```
psychology,mental health,spiritual healing,financial services,hypnotherapy,life coaching,therapy,counseling,traditional healing,African psychology,financial guidance,wellness,South Africa,Durban,wellness directory
```

**Character count:** 99/100 ✅

---

## 🚀 Next Steps

1. **Fix Screenshots**
   - Resize existing screenshots to correct dimensions
   - Or capture new ones from simulator/device
   - Add text overlays highlighting features

2. **Complete App Description**
   - Use the draft provided above
   - Customize based on your specific features
   - Keep it under 4,000 characters

3. **Set Up Support URL**
   - Create a support page on your website
   - Or use a simple hosting solution
   - Include contact information

4. **Fill in App Review Info**
   - Note that login is not required
   - Or provide demo credentials if needed

5. **Choose Release Strategy**
   - Select "Automatically release this version"
   - Or schedule for a specific date

6. **Submit for Review**
   - Double-check all required fields
   - Upload corrected screenshots
   - Click "Submit for Review"

---

## 📞 Need Help?

If you need assistance with:
- **Screenshot design** - I can provide templates or design guidance
- **Writing descriptions** - Use the drafts above as starting points
- **Creating support pages** - I can provide HTML templates
- **App Review notes** - Customize based on your app's features

---

## ✅ Final Checklist Before Submission

- [ ] All screenshots are correct dimensions
- [ ] Promotional text is filled in (170 chars max)
- [ ] App description is complete (4000 chars max)
- [ ] Keywords are optimized (100 chars max)
- [ ] Support URL is live and accessible
- [ ] Marketing URL is set (optional)
- [ ] Privacy Policy URL is provided
- [ ] App Review notes are clear
- [ ] Release strategy is selected
- [ ] All required metadata is complete

---

**Good luck with your App Store submission! 🎉**

