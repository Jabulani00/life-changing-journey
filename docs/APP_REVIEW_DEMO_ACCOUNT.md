# App Review Demo Account

Apple reviewers need a **working email/password account** with an **active membership** if booking or tier-gated features are demonstrated.

## Recommended account

| Field | Value |
|-------|-------|
| Email | `reviewer@lifechangingjourney.co.za` |
| Password | Choose a strong password before submit (do not commit to git) |
| Membership | Active Silver or Gold via [membership web](https://www.lifechangingjourney.co.za/plans) |

## Setup steps

1. In the **mobile app** or **membership web**, register `reviewer@lifechangingjourney.co.za`.
2. Complete membership purchase on the website (test mode / comp account as appropriate).
3. Confirm Firestore `user_memberships/{uid}` shows `status: active`.
4. Sign in on a test device and walk through the [pre-submit test script](APPLE_APP_REVIEW_ANALYSIS.md#pre-submit-test-script).
5. Paste the **same email and password** into App Store Connect → App Review Information → Notes.

## Do not use for deletion test

Account deletion permanently removes the Firebase user. Use a **separate throwaway account** to test Profile → Delete account.

## Deploy account deletion backend

```bash
firebase deploy --only functions
```

Then verify deletion on a throwaway account before submitting Build 31+.
