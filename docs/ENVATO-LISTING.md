md
# Shooter — Skill Arcade Platform (Next.js + Firebase + Genkit AI)

A premium **skill-based** gaming platform with timing & puzzle challenges, real-time rooms, an **AI Coach/Opponent**, and a full operator dashboard. Built with Next.js + Firebase (Auth, Firestore, Functions) and Genkit for pluggable AI (Gemini or OpenAI).

> **Compliance:** Skill-based entertainment. **No real-money gambling** or chance-only games. Scoring is **server-authoritative** and verified on the backend.

---

## Key Features
- **AI Coach & Opponent** (Genkit): concise hints, server-generated bot moves, and personalized challenge suggestions.
- **Skill games**: timing, puzzles, chess-tactics, memory — not chance-only.
- **Real-time rooms**: secure sessions with events stream and server seeds.
- **Leaderboards & seasons**: append-only, tamper-proof writes from Functions.
- **Operator dashboard**: enable/disable games, feature flags, cooldowns, moderation.
- **Optional credits wallet**: Stripe-ready webhooks + append-only ledger.
- **Modern UI**: glassmorphism, Dark/Light theme, responsive, shadcn-ui components.
- **Secure by design**: Firestore rules, anti-cheat checks, rate-limits, AI usage logs.
- **Extensible puzzle generator**: server-verified math puzzles (extend to memory/path/chess).

---

## What’s Included
- Full **source code** (Next.js app + Firebase Functions with Genkit flows)
- **AI flows**: coach, opponent, suggester, puzzle generator
- **Moderation trigger** + **daily insights** (scheduled)
- **Firestore security rules** and **indexes**
- **Docs**: README, INSTALL, this listing, and AI Agent overview
- **Demo data** / seeding script (optional, if provided)

---

## Requirements
- Node **20+**
- Firebase project with **Auth**, **Firestore**, **Functions**
- **Firebase CLI** (`npm i -g firebase-tools`)
- One AI key (choose **Gemini** or **OpenAI**) stored as a **Functions Secret**
- Optional: **Stripe** account (if enabling credits wallet)

---

## Live Demo (optional)
- Web: `https://<your-demo-domain>`  
- Test Login: `demo@user.app / ********`  
*(Remove if you’ll only provide a local demo.)*

---

## Installation (Quick)
1. Clone → `npm i`
2. Create `.env.local` and add Firebase client config.
3. Deploy rules & indexes: `firebase deploy --only firestore`
4. Set **one** AI secret:  
   - Gemini: `firebase functions:secrets:set GEMINI_API_KEY`  
   - OpenAI: `firebase functions:secrets:set OPENAI_API_KEY`
5. Build & deploy Functions:  
   - `cd functions && npm i && npm run build && cd ..`  
   - `firebase deploy --only functions`
6. Start the app: `npm run dev` (or deploy hosting).

See full steps in `docs/INSTALL.md`.

---

## Support
- Includes installation help, clarification of features, bug fixes for reproducible issues, and security patches.  
- Excludes custom feature development, third-party account issues, and unrelated server admin.  
- Response window: **24–72h** on business days.  
See `SUPPORT.md` for details.

---

## FAQ
**Is this gambling software?**  
No. Shooter is **skill-based** (timing/puzzles/strategy). No betting engine or chance-only mechanics.

**Which AI model does it use?**  
Genkit supports **Gemini (Google AI)** and **OpenAI**. Configure one secret and deploy.

**Can I add my own games?**  
Yes. Add a game definition with server validation and wire it to rooms + scoring hooks.

**Do I need Stripe?**  
Only if you enable the optional **credits wallet**.

**Can I self-host outside Firebase?  
Yes, but the project is optimized for Firebase. Porting requires backend adjustments.

---

## Changelog
See `CHANGELOG.md`.

---

## Screenshot Suggestions (upload to `docs/screenshots/`)
1. `cover-hero.webp` — “Shooter — Skill Arcade Platform (Next.js + Firebase + Genkit AI)”
2. `dashboard-market-cards.webp` — “Timing challenges with server-authoritative windows”
3. `puzzle-center.webp` — “Puzzle hub + AI Coach”
4. `chess-challenges.webp` — “Daily chess tactics — server-verified”
5. `rooms-grid.webp` — “Real-time rooms, chat, leaderboards”
6. `admin-games.webp` — “Operator dashboard: flags, cooldowns, enable/disable”
7. `admin-performance.webp` — “KPI overview & AI insights”
8. `theme-light.webp` — “Light & Dark themes, glass UI”

---

## Tags
`nextjs, nodejs, firebase, genkit, google ai, openai, typescript, realtime, multiplayer, skill games, arcade, ai coach, dashboard, stripe, puzzle, chess, rooms`

---

### License
Distribute with the appropriate **Envato Market license**. Remove any OSS license that conflicts with Envato terms.