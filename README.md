# Shooter — Skill Arcade Platform (Next.js + Firebase + Genkit AI)

A premium **skill-based** gaming platform with timing & puzzle challenges, real-time rooms, an **AI Coach/Opponent**, and a full operator dashboard. Built with Next.js + Firebase (Auth, Firestore, Functions) and Genkit for pluggable AI (Gemini or OpenAI).

> **Compliance**
> Shooter is **skill-based entertainment**. **No real-money gambling** or chance-only games are included. Scoring is **server-authoritative** and verified on the backend.

---

## Table of Contents

* [Highlights](#highlights)
* [Screenshots](#screenshots)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Configuration](#configuration)

  * [.env / environment](#env--environment)
  * [Firebase setup](#firebase-setup)
  * [AI provider (Genkit)](#ai-provider-genkit)
* [Development](#development)
* [Deployment](#deployment)
* [Security & Fairness](#security--fairness)
* [Admin & Operations](#admin--operations)
* [FAQ](#faq)
* [Changelog](#changelog)
* [Support](#support)
* [License](#license)

---

## Highlights

* 🎯 **Skill-first games**: timing, puzzles, chess-tactics, memory — not chance-only.
* 🤖 **AI Coach & Opponent** (Genkit): concise hints, server-generated bot moves, personalized challenge suggestions.
* 🕹️ **Real-time rooms**: secure sessions, events stream, leaderboards & seasons.
* 🛠️ **Operator dashboard**: enable/disable games, feature flags, cooldowns, moderation.
* 💳 **Credits wallet (optional)**: Stripe-ready webhooks & append-only ledger.
* 🧊 **Beautiful UI**: glassmorphism, Dark/Light themes, responsive.
* 🔐 **Server-authoritative scoring**: anti-cheat checks, rate-limits, immutable logs.
* 🧩 **Puzzle generator** (extensible): server-verified challenges.
* 🧭 **Daily insights**: scheduled AI summaries of KPIs & tuning suggestions.

---

## Screenshots

<div align="center">
  <img src="docs/screenshots/Admin Command" alt="Admin Command" width="850" />
  <img src="docs/screenshots/AI Dice" alt="AI Dice" width="850" />
  <img src="docs/screenshots/Brain Buzzles Games" alt="Brain Buzzles Games" width="850" />
  <img src="docs/screenshots/Buzzle Games" alt="Buzzle Games" width="850" />
  <img src="docs/screenshots/Chess Challenges" alt="Chess Challenges" width="850" />
  <img src="docs/screenshots/Chess in Pink Mode" alt="Chess in Pink Mode" width="850" />
  <img src="docs/screenshots/Game Control Room" alt="Game Control Room" width="850" />
  <img src="docs/screenshots/Game Performance" alt="Game Performance" width="850" />
  <img src="docs/screenshots/Hit or Miss" alt="Hit or Miss" width="850" />
  <img src="docs/screenshots/Home AI Challenge" alt="Home AI Challenge" width="850" />
  <img src="docs/screenshots/Platfrom Dashboad" alt="Platfrom Dashboad" width="850" />
  <img src="docs/screenshots/ShotGames" alt="ShotGames" width="850" />
  <img src="docs/screenshots/Social Games" alt="Social Games" width="850" />
  <img src="docs/screenshots/User Wallet" alt="User Wallet" width="850" />
</div>

---

## Architecture



# ShooterGun — Skill Arcade Platform (Next.js + Firebase + Genkit AI)

A premium **skill-based** gaming platform with timing & puzzle challenges, real-time rooms, an **AI Coach/Opponent**, and a full operator dashboard. Built with Next.js + Firebase (Auth, Firestore, Functions) and Genkit for pluggable AI (Gemini or OpenAI).

> **Compliance**  
> Shooter is **skill-based entertainment**. **No real-money gambling** or chance-only games are included. Scoring is **server-authoritative** and verified on the backend.

---

## Table of Contents
- [Highlights](#highlights)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [.env / environment](#env--environment)
  - [Firebase setup](#firebase-setup)
  - [AI provider (Genkit)](#ai-provider-genkit)
- [Development](#development)
- [Deployment](#deployment)
- [Security & Fairness](#security--fairness)
- [Admin & Operations](#admin--operations)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Support](#support)
- [License](#license)

---

## Highlights
- 🎯 **Skill-first games**: timing, puzzles, chess-tactics, memory — not chance-only.
- 🤖 **AI Coach & Opponent** (Genkit): concise hints, server-generated bot moves, personalized challenge suggestions.
- 🕹️ **Real-time rooms**: secure sessions, events stream, leaderboards & seasons.
- 🛠️ **Operator dashboard**: enable/disable games, feature flags, cooldowns, moderation.
- 💳 **Credits wallet (optional)**: Stripe-ready webhooks & append-only ledger.
- 🧊 **Beautiful UI**: glassmorphism, Dark/Light themes, responsive.
- 🔐 **Server-authoritative scoring**: anti-cheat checks, rate-limits, immutable logs.
- 🧩 **Puzzle generator** (extensible): server-verified challenges.
- 🧭 **Daily insights**: scheduled AI summaries of KPIs & tuning suggestions.

---

## Screenshots
> These screenshots are hosted on Firebase Storage.

<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.17.13%E2%80%AFpm.png?alt=media&token=d7c31379-025c-4d10-aa71-a540051bc0ca" alt="Game Control Room" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.16.50%E2%80%AFpm.png?alt=media&token=3becbd74-bf65-4c14-ad8d-44de9dd096a8" alt="Admin Panel" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.16.15%E2%80%AFpm.png?alt=media&token=0222bf01-5fe2-4828-a895-f9f306975f4c" alt="Platform Live updates" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.15.50%E2%80%AFpm.png?alt=media&token=a7a40597-f891-4346-aabd-0a2451d3b9e1" alt="User Wallet" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.15.01%E2%80%AFpm.png?alt=media&token=3a61b4f2-623b-4609-af60-5595d1f6e3fd" alt="Chess League 32 players" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.14.56%E2%80%AFpm.png?alt=media&token=b87caa97-a06c-41fd-bbf0-384a032b17d3" alt="Chess solo puzzles" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.14.25%E2%80%AFpm.png?alt=media&token=07bdfa50-641f-41c7-a734-0491b87250f4" alt="AI Puzzles" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.07.59%E2%80%AFpm.png?alt=media&token=ed385078-721d-409d-a03f-f6e2fcda1768" alt="Games" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.07.41%E2%80%AFpm.png?alt=media&token=764a9abf-099e-44ab-ac09-0046dcab889a" alt="Shooting puzzles" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.16.35%E2%80%AFpm.png?alt=media&token=94642bd0-0a71-4da9-a9b6-d7eca9e4a36a" alt="Platform Live updates" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.09.24%E2%80%AFpm.png?alt=media&token=ce230552-bb60-47d9-9140-8f1e4e2ead32" alt="Gameplay screenshot 1" width="850" />
  <img src="https://firebasestorage.googleapis.com/v0/b/luckshots-a4e60.firebasestorage.app/o/Screenshot%202025-08-16%20at%203.08.20%E2%80%AFpm.png?alt=media&token=ca276bdf-06b0-4e71-9676-34126d49bda9" alt="Gameplay screenshot 2" width="850" />
</div>

---

## Architecture


To get started, take a look at `src/app/page.tsx`.
