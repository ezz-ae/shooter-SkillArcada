
# Shooter — Skill Arcade Platform (Next.js + Firebase + Genkit AI)

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
> Place images under `docs/screenshots/` and keep them ~1600×1000 (WebP/PNG).  
> Replace filenames below with your assets.

<div align="center">
  <img src="docs/screenshots/cover-hero.webp" alt="Hero" width="850" />
  <img src="docs/screenshots/dashboard-market-cards.webp" alt="Timing challenges" width="850" />
  <img src="docs/screenshots/puzzle-center.webp" alt="Puzzle & AI coach" width="850" />
  <img src="docs/screenshots/chess-challenges.webp" alt="Chess tactics" width="850" />
  <img src="docs/screenshots/rooms-grid.webp" alt="Rooms & leaderboards" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.17.13 pm.png" alt="Game Control Room" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.16.50 pm.png" alt="Admin Panel" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.16.15 pm.png" alt="Platform Live updates" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.15.50 pm.png" alt="User Wallet" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.15.01 pm.png" alt="Chess League 32 players" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.14.56 pm.png" alt="Chess solo puzzles" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.14.25 pm.png" alt="AI Puzzles" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.07.59 pm.png" alt="Games" width="850" />
  <img src="docs/screenshots/Screenshot 2025-08-16 at 3.07.41 pm.png" alt="Shooting puzzles" width="850" />
  <img src="docs/screenshots/admin-games.webp" alt="Admin controls" width="850" />
</div>

---

## Architecture
