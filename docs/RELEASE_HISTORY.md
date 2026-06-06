# Release History — Life Changing Journey

Production EAS builds for **iOS App Store**, **Google Play**, and **Huawei App Gallery**.

**Marketing version:** `1.0.0` (all platforms)  
**EAS project:** `@jabumb/life-changing-journey` (`bc265066-d7a0-43c1-ae2c-d7d7a013bff8`)  
**Bundle / package ID:** `com.lifechangingjourney.app`  
**Canonical site:** https://www.lifechangingjourney.co.za

Related: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) (features in these builds), [IOS_RELEASE_GUIDE.md](../IOS_RELEASE_GUIDE.md), [IOS_PRE_RELEASE_CHECKLIST.md](../IOS_PRE_RELEASE_CHECKLIST.md).

---

## June 2026 — Multi-platform production update

This release adds the **terms gate**, **production auth**, **URL normalization** (`.co.za`), and store-ready EAS config. See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for full feature detail.

### Successful builds (use these)

| Platform | Profile | Version | Build # | EAS Build ID | Artifact |
|----------|---------|---------|---------|--------------|----------|
| **iOS** | `production` | 1.0.0 | **11** | `28c97a0a-4198-4577-843c-d270b4076ab6` | [IPA](https://expo.dev/artifacts/eas/637YiBwf57VxDoVP9bAugQ.ipa) |
| **Google Play** | `production` | 1.0.0 | **versionCode 3** | `41804e78-9e3f-4590-b4a5-71a5309cd2ef` | [AAB](https://expo.dev/artifacts/eas/968gtV8ZV6Dyx2WxfxwHVa.aab) |
| **Huawei AppGallery** | `production-huawei` | 1.0.0 | **versionCode 4** | `1cd28293-e576-4dc0-b849-021a0b8410f2` | [APK](https://expo.dev/artifacts/eas/4yqPkgV5YSHc1tFKTFx6dw.apk) |

**EAS build logs**

- iOS: https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/28c97a0a-4198-4577-843c-d270b4076ab6
- Android (Play): https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/41804e78-9e3f-4590-b4a5-71a5309cd2ef
- Huawei: https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/1cd28293-e576-4dc0-b849-021a0b8410f2

### Production environment (all profiles)

Set in `eas.json` `production` / `production-huawei`:

| Variable | Value |
|----------|-------|
| `EXPO_PUBLIC_ENV` | `production` |
| `EXPO_PUBLIC_LCJ_WEB_URL` | `https://www.lifechangingjourney.co.za` |
| `EXPO_PUBLIC_ENABLE_AUTH` | `true` |
| `EXPO_PUBLIC_STORE_CHANNEL` | `huawei` (Huawei profile only) |

`eas.json` uses `appVersionSource: "remote"` and `autoIncrement: true` — version numbers on EAS may advance beyond `app.json` locals.

### Submit / distribution status

| Store | Status | Notes |
|-------|--------|-------|
| **iOS / TestFlight** | Submit blocked | Apple error: *required agreement missing or expired*. Sign agreements at [App Store Connect](https://appstoreconnect.apple.com/agreements/), then: `eas submit --platform ios --id 28c97a0a-4198-4577-843c-d270b4076ab6 --non-interactive` |
| **Google Play** | Not submitted | Missing `google-play-service-account.json`. Add key per [Expo guide](https://expo.fyi/creating-google-service-account), then: `eas submit --platform android --id 41804e78-9e3f-4590-b4a5-71a5309cd2ef --non-interactive` (internal track in `eas.json`) |
| **Huawei AppGallery** | Manual upload | No EAS submit. Upload APK in [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) |

**iOS App Store Connect**

| Item | Value |
|------|-------|
| ASC App ID | `6755474250` |
| Apple ID | `lifechangingjourney84@gmail.com` |
| Team ID | `4B3H2MM88X` |
| TestFlight | https://appstoreconnect.apple.com/apps/6755474250/testflight/ios |

### TestFlight — What to Test (English U.S.)

Paste into App Store Connect → TestFlight → What to Test:

> Please test this build on a physical iPhone: accept the Terms & Policies on first launch, then sign in or register, book a service, and open Membership to confirm it goes to https://www.lifechangingjourney.co.za/plans. Also check Events, Daily Word, and Live, and report any crashes, login problems, or broken links with your device model, iOS version, and steps to reproduce. Push notifications are not included in this build, so focus on terms acceptance, auth, booking, membership, and content flows.

### iOS-specific notes (build 11)

- **`expo-notifications` plugin removed** for this build; `plugins/withoutPushEntitlement.js` strips iOS `aps-environment` so the Nov 2025 provisioning profile still works.
- **Native iOS push does not work** in build 11. To enable: run `eas credentials -p ios` (interactive, Apple login), regenerate App Store provisioning profile with Push Notifications, re-add `expo-notifications` to `app.json` plugins, rebuild.
- **APNs** not configured for this release.

### Android-specific notes

- **First Android keystore** generated on EAS during the Play Store build (`41804e78…`). Stored remotely; do not lose EAS project access.
- **Huawei APK** uses the same signing credentials as Play; `versionCode` auto-incremented separately per build.
- `POST_NOTIFICATIONS` permission is declared; push behaviour depends on `expo-notifications` native setup (plugin not in current `app.json`).

### Failed builds (June 2026 — do not use)

| Platform | Build ID | Build # | Failure |
|----------|----------|---------|---------|
| iOS | `0bf78339-baca-42fe-9636-cdea9b943de8` | 1 | `npm ci` — `package-lock.json` out of sync (npm 11 vs EAS npm 10) |
| iOS | `902fbd20-9ead-460d-bc85-b17d676f3fd3` | 2 | Same lock file issue |
| iOS | `91560299-4c85-46ab-88cb-3de417b9fc9d` | 5 | Provisioning profile missing Push Notifications capability |
| iOS | `52d86ea8-2120-4d7e-b958-760daba5f91c` | 9 | Same push provisioning error (before entitlement workaround) |

**Fixes applied:** Regenerate lock file with `npx npm@10.9.3 install`; remove `expo-notifications` plugin and add `withoutPushEntitlement.js` for iOS.

---

## November 2025 — Initial iOS release

| Field | Value |
|-------|-------|
| Build ID | `59e41d50-5bfa-4598-8bca-8fe6859d0714` |
| Version / build | `1.0.0` / **1** |
| Status | Finished; submitted to App Store Connect |
| IPA | https://expo.dev/artifacts/eas/c6NR7NK3Vt9A9Ehotjp5um.ipa |
| Commit | `d57ead76` |
| Logs | [EAS build](https://expo.dev/accounts/jabumb/projects/life-changing-journey/builds/59e41d50-5bfa-4598-8bca-8fe6859d0714) |

Baseline before terms gate, production env hardening, and push notification code. Provisioning profile dated **2025-11-19** (no Push Notifications capability).

---

## Rebuild commands

```bash
# iOS App Store
eas build --platform ios --profile production --non-interactive

# Google Play (AAB)
eas credentials:configure-build -p android -e production   # first time only
eas build --platform android --profile production --non-interactive

# Huawei App Gallery (APK)
eas build --platform android --profile production-huawei --non-interactive

# Submit (after credentials / agreements ready)
eas submit --platform ios --latest --non-interactive
eas submit --platform android --latest --non-interactive
```

**Lock file:** EAS uses npm 10. Regenerate locally before building:

```bash
npx npm@10.9.3 install
```

---

## Pre-release checklist (all platforms)

- [ ] `firebase deploy --only firestore:rules` (collections: `motivations`, `push_tokens`, etc.)
- [ ] Terms gate tested on fresh install
- [ ] Membership opens `https://www.lifechangingjourney.co.za/plans`
- [ ] Production auth / booking flows tested
- [ ] **iOS:** Apple agreements signed; provisioning profile updated if enabling push
- [ ] **Play:** `google-play-service-account.json` in project root (gitignored)
- [ ] **Huawei:** APK uploaded manually in AppGallery Connect

---

## Credentials reference

| Platform | Credential | Location / ID |
|----------|------------|----------------|
| iOS | Distribution cert | EAS remote (expires Nov 2026) |
| iOS | Provisioning profile | EAS remote (Nov 2025, no push) |
| iOS | ASC API key (submit) | `86VN8HMUWG` on EAS servers |
| Android | Upload keystore | EAS remote (created Jun 2026) |
| Play | Service account JSON | `./google-play-service-account.json` (not in repo) |
| EAS account | Owner | `jabumb` |

---

*Last updated: June 6, 2026*
