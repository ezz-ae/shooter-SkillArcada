md
# Install & Setup Guide — Shooter

This guide walks you from zero → running app, then deploys Firebase rules, indexes, and Functions (with Genkit AI).

---

## 1) Prerequisites
- Node **20+**
- **Firebase CLI**: `npm i -g firebase-tools`
- Firebase project ID: **YOUR_PROJECT_ID**
- One AI key (choose **Gemini** or **OpenAI**) to store as a **Functions Secret**

---

## 2) Clone & install
```
bash
git clone <your-repo-url>
cd shooter
npm i
```
`

---

## 3) Configure `.env.local` (Next.js client)

Create `.env.local` in the project root and add your Firebase web config:
```
env
# Client (safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
> These values come from Firebase Console → Project settings → **Your apps** (Web).

---

## 4) Firebase initialization (once)

If you haven’t, connect the repo to your project:
```
bash
firebase use <YOUR_PROJECT_ID>
```
Deploy rules & indexes:
```
bash
firebase deploy --only firestore
```
---

## 5) AI provider (pick one)

### A) Gemini (Google AI)
```
bash
firebase functions:secrets:set GEMINI_API_KEY
```
### B) OpenAI
```
bash
firebase functions:secrets:set OPENAI_API_KEY
```
Optional (if supported in your Functions): set provider
```
bash
# default is "google" (Gemini). Set to "openai" to switch.
# You can store this in Functions runtime config or your deployment env.
AI_PROVIDER=openai
```
---

## 6) Functions (Genkit flows + triggers)

Install & build:
```
bash
cd functions
npm i
npm run build
cd ..
```
Local emulator (optional):
```
bash
firebase emulators:start --only functions,firestore,hosting
```
Deploy Functions:
```
bash
firebase deploy --only functions
```
Exports include:

* `aiCoach_getHint` (callable via **onCallGenkit**)
* `aiOpponent_nextMove` (callable)
* `aiSuggest_challenge` (callable)
* `puzzles_generate` (callable)
* `moderate_onMessageCreate` (Firestore trigger)
* `admin_dailyInsights` (scheduled)

---

## 7) Start the web app (local)
```
bash
npm run dev
# open http://localhost:3000
```
Login or create an account (Email/Password must be enabled in **Firebase Auth**).

---

## 8) Promote an admin (optional)

Use a tiny admin script (server-side with Admin SDK), or a protected callable, to set a custom claim:
```
ts
// adminSetClaim.ts (example — run with Node/ts-node in a trusted environment)
import * as admin from "firebase-admin";
admin.initializeApp();
await admin.auth().setCustomUserClaims("<UID>", { role: "admin", admin: true });
console.log("Admin claim set.");
```
After setting claims, the user must refresh their ID token (sign out/in).

---

## 9) Using the AI callables in your app

Example (client):
```
ts
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/lib/firebaseApp";

export async function getCoachHint(roomId: string, uid: string) {
  const fn = httpsCallable(getFunctions(app), "aiCoach_getHint");
  const res: any = await fn({ uid, roomId });
  return res.data?.hint as string;
}
```
---

## 10) Production deploy
```
bash
# Make sure secrets are set and functions are built
firebase deploy --only functions,firestore,hosting
```
---

## 11) Troubleshooting

**Missing index error**
Click the link in the Firestore error message, or ensure `firestore.indexes.json` is deployed:
```
bash
firebase deploy --only firestore:indexes
```
**Permission denied / rules**
Confirm you’re authenticated on the client and your rules match the collections you’re using (see `firestore.rules`). Admin writes must come from Functions (Admin SDK bypasses rules).

**Functions error: missing API key**
Ensure you’ve set **one** secret (Gemini or OpenAI), then redeploy Functions:

```
bash
firebase functions:secrets:set GEMINI_API_KEY   # or OPENAI_API_KEY
firebase deploy --only functions
```
**Rate limit exceeded**
The AI callables include per-UID per-minute limits. Adjust in code if needed.

**CORS / callable failures**
Use the Firebase **Functions client** (`httpsCallable`) and ensure App Check isn’t blocking local dev (temporarily disable or use a debug token during development).

---

## 12) Security & Compliance Checklist

* [ ] No secrets committed; all keys in **Functions Secrets** or env.
* [ ] **Server-authoritative scoring** for all games that submit scores.
* [ ] **Clients can’t write** to `leaderboards`, `admin_reports`, or `rate_limiter`.
* [ ] **Moderation** trigger enabled for `messages/*`.
* [ ] **Daily insights** scheduled and writing to `admin_reports/*`.
* [ ] README shows **skill-based** compliance statement.

---

## 13) Uninstall / Clean up (optional)

* Delete deployed Functions in Firebase Console if you’re done testing.
* Remove secrets: `firebase functions:secrets:destroy GEMINI_API_KEY` (or `OPENAI_API_KEY`).
* Remove local `.env.local` if sharing the project.

---

### Need help?

* **Setup questions:** open an issue with steps to reproduce + screenshots.
* **Security reports:** follow `SECURITY.md`.
* **Envato buyers:** include purchase code in your support request.

Good luck & have fun!