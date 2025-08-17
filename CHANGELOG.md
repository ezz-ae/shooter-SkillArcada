# Changelog

All notable changes to this project will be documented here.

## [1.0.0] – 2025-08-17
### Added
- **Genkit AI** functions: Coach (`aiCoach_getHint`), Opponent (`aiOpponent_nextMove`), Suggester (`aiSuggest_challenge`), Puzzle Generator (`puzzles_generate`).
- **Moderation** trigger and **Daily Insights** scheduler.
- **Envato-ready docs**: README with compliance notice, INSTALL/LISTING in \`docs/\`.
- **UI**: CoachHint component and **useToast** hook with Toaster.
- **Security**: Server-authoritative scoring, Firestore rules & indexes.

### Changed
- Rewrote product copy to emphasize **skill-based entertainment** (no chance-only mechanics).
- Repo structure finalized for release (functions/, docs/, scripts/).

### Fixed
- Next.js build failure from mis-placed \`"use client"\` directive in \`use-toast.tsx\`.

[Unreleased]: https://github.com/MAHMOUDEZZ12/shooter/compare/v1.0.0...HEAD
