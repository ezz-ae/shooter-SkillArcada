git# Shooter — Skill Arcade Platform (Next.js + Firebase + Genkit AI)

A premium **skill-based** gaming platform with timing & puzzle challenges, real-time rooms, an **AI Coach/Opponent**, and a full operator dashboard. Built with Next.js + Firebase (Auth, Firestore, Functions) and Genkit for pluggable AI (Gemini or OpenAI).

> **Compliance:** Shooter is skill-based entertainment. No real-money gambling or chance-only games are included. Scoring is server-authoritative and verified on the backend.

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



