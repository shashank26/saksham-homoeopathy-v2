# App Store UGC Compliance (Guideline 1.2)

This document supports App Review resubmission for Saksham Homoeopathy chat moderation, post reporting, and legal acceptance.

## Manual setup before testing

### Firestore security rules

Add rules for moderation collections:

```
match /moderation_reports/{id} {
  allow create: if request.auth != null;
  allow read: if request.auth != null;
}
match /user_blocks/{id} {
  allow create: if request.auth != null
    && request.resource.data.blockerId == request.auth.uid;
  // Blocker can delete their own block; authenticated clinic staff can reverse any block from Moderation.
  allow delete: if request.auth != null;
  allow read: if request.auth != null;
}
```

Allow users to update their own terms fields on `users/{uid}`:

```
allow update: if request.auth.uid == userId;
```

### App Store metadata

Ensure Privacy Policy URL, Terms of Use (EULA) URL, and support contact in App Store Connect match in-app links (`constants/legal.ts`).

---

## Testing checklist

- [ ] Fresh install shows **Terms acceptance** screen before phone login
- [ ] Continue is disabled until checkbox is checked
- [ ] Terms / Privacy / Contact links open in-app from terms gate
- [ ] After accept, login works normally
- [ ] Bumping `TERMS_VERSION` in `constants/legal.ts` forces re-acceptance
- [ ] After login, `users/{uid}` has `termsVersion` and `termsAcceptedAt`
- [ ] Login footer links open in-app Privacy, Terms, Contact Us
- [ ] Long-press on **incoming** chat message opens Report Message sheet
- [ ] Submitting report shows success toast
- [ ] Chat header **⋮** menu offers Report User and Block User
- [ ] Block confirm prevents sending new messages (input disabled)
- [ ] After blocking, chat **⋮** offers **Unblock User** and messaging resumes
- [ ] Patient Posts tab **⋮** offers **Report Post**; submit shows success toast
- [ ] Doctor **Alerts** tab shows in-app notification for new report (message / user / post)
- [ ] Doctor **Moderation** drawer item lists report in realtime (including **Post report**)
- [ ] Doctor **Moderation** screen lists blocked user pair with **Unblock** action
- [ ] Account deletion removes user's reports and blocks

---

## App Review demonstration steps (screen recording)

Record on a physical device or simulator. Use two accounts if possible: one patient (`USER`) and one doctor (`DOCTOR`).

### 1. Terms acceptance flow

1. Delete and reinstall the app (or clear app data).
2. Launch the app.
3. Show the **Terms of Use** gate with zero-tolerance messaging.
4. Tap **Read Terms of Use** and **Read Privacy Policy** — show in-app WebView screens, then go back.
5. Tap **Contact Us** — show support email screen.
6. Check **I agree to the Terms of Use and Privacy Policy**.
7. Tap **Continue**.
8. Show the login screen and complete OTP sign-in.

### 2. Report message flow

1. Sign in as a patient (or doctor).
2. Open **Chat** tab and open a conversation.
3. Long-press an **incoming** message from the other party.
4. Select **Report Message** (sheet opens).
5. Choose a reason (e.g. **Inappropriate Content**) and tap **Submit report**.
6. Show the success toast: *"The clinic administrator has been notified."*

### 3. Report user flow

1. In the same chat, tap the **⋮** menu in the header.
2. Tap **Report User**.
3. Choose **Harassment** (or another reason) and submit.
4. Show success toast.

### 4. Block and unblock user flow

1. In chat header, tap **⋮** → **Block User**.
2. Confirm the block alert.
3. Show that message input is disabled.
4. Attempt to type/send — input is disabled; send does not work.
5. Tap **⋮** → **Unblock User** and confirm.
6. Show that messaging is available again.

### 5. Report post flow

1. Sign in as a **patient**.
2. Open the **Posts** tab.
3. Tap **⋮** on a post → **Report Post**.
4. Choose a reason and submit.
5. Show the success toast.

### 6. Admin visibility of reports and unblock

1. Sign in as **doctor/admin**.
2. Open **Alerts** tab — show notification: *"New report: …"*
3. Open drawer → **Moderation**.
4. Show the **Reports** section with message / user / **post** reports.
5. Show **Blocked users** section with the block record.
6. Tap **Unblock** on a block card and confirm the pair is removed.

---

## Notes for reviewers

- Chat is limited to patients and clinic staff (not a public social network).
- Clinic posts are also user-generated content and can be reported.
- Terms acceptance is required before registration/login.
- Users can report objectionable messages, posts, and abusive users.
- Users can block others; blocked parties cannot continue messaging.
- Blocks are reversible by the blocker (chat **Unblock**) or by clinic staff (Moderation **Unblock**).
- Reports notify the clinic administrator via in-app Alerts.
