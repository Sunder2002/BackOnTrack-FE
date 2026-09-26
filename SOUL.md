# BackOnTrack continuity log

This file is the durable handoff for any future work session. Read it before changing the product, then update it after every meaningful milestone.

## Product north star

BackOnTrack tells a temporarily behind student the next best block of learning and recalculates the route when the student's mastery or available time changes. The demo must make two things obvious within minutes: the recommendation is grounded in the curriculum, and the plan visibly re-routes as the student changes.

## Canonical demo

- Student: Riya
- Course: Operating Systems
- Exam: Friday at 11:00 AM
- Time available: 6 hours, with a demo change to 3 hours
- Missed content: Weeks 4–6
- Initial next action: CPU Scheduling, 35 minutes, mastery 38%
- Mastery result: CPU Scheduling moves from 38% to 72%
- Re-route: 18 minutes move to Deadlocks
- End state: Deadlocks becomes the next best 35-minute block

## Experience principles

- Calm under pressure; capable academic coach with restrained dry humour.
- The product itself is the pitch. No marketing landing page.
- Route/navigation language, not a literal railway.
- Every recommendation has an inspectable reason and source evidence.
- No shame, fake intelligence, fake behaviour detection, confetti, points, streaks, or generic AI styling.
- Brand, tagline, logo and theme copy stay centralized in `src/config/brand.ts`.
- UI consumes typed API interfaces; demo fixtures stay outside components.

## Visual thesis

An editorial academic control room: crisp paper-white working surfaces on a quiet mineral background, deep ink typography, route-green structure, amber used only for attention, and a precise line-and-node route as the memorable motif. Dense enough to feel useful, never like an LMS dashboard.

## Planned stack

- Next.js App Router + TypeScript
- Tailwind CSS with product-specific design tokens
- Accessible Radix/shadcn-style primitives where interaction semantics matter
- Lucide icons
- React state for deterministic demo state
- Vitest + Testing Library for interaction coverage

## Required routes and states

- `/student`: overview, next best block, recovery route, coach rail
- `/student/plan`: detailed route and reallocation state
- `/student/focus`: four-step CPU Scheduling focus flow and mastery check
- `/student/mastery`: mastery map and today's changes
- `/student/ask`: structured time-budget intent and plan recalculation
- `/student/sources`: trusted curriculum inputs
- `/faculty`: aggregate cohort gaps, privacy-conscious

## Required interactions

- Why-this explanation drawer with evidence and sources
- Start block → focus mode
- Escape closes overlays first; active focus then opens a genuine exit dialog
- Mastery check updates 38% → 72% and triggers the re-route explanation
- Time budget 6h → 3h visibly recalculates the plan
- `?` shortcuts dialog, Cmd/Ctrl+K command palette, `S` start, `P` plan
- Demo reset available in demo mode via Ctrl/Cmd+Shift+R and `?demo=riya` URL param

## Current status

- 2026-09-26: Product brief read in full; repository initialised.
- 2026-09-26: Full implementation complete — all 7 routes built, all screens functional, typed API boundary with mock client, full demo journey operational.
- 2026-09-26: Brand config expanded with full palette, font stacks and copy centralisation.
- 2026-09-26: Dynamic readiness ring reacts to plan.readiness.
- 2026-09-26: Fullscreen focus mode with Web Audio ambient chords and exit quotes.
- 2026-09-26: Added signature exit quote ("Now if you are not on BackOnTrack, you will be on railway track.") across Focus & Ask screens.
- 2026-09-26: Added animated Backlog Fee warning card (₹3,500 only) with parent reality check photo in Coach Rail.
- 2026-09-26: Production HTTP client (`src/services/api/http-client.ts`) created and connected to `src/services/api/client.ts` with `.env` toggle.
- 2026-09-26: Cleaned file system (removed non-standard scratch files, configured cache path for tsbuildinfo, purged unused local store, stopped background processes).
- 2026-09-26: All 5 CI quality gates passing cleanly (Prettier, ESLint zero warnings, TypeScript, Vitest 7/7 tests, Next.js standalone build).
- 2026-09-26: Repository cleaned of cache artifacts and pushed to `origin/main` on GitHub.

## Verification record

Quality gates verified clean on Node 22 LTS / 24 with pnpm 11.19:

```bash
pnpm format:check       # PASS (Prettier)
pnpm lint --max-warnings=0 # PASS (ESLint 0 errors, 0 warnings)
pnpm typecheck          # PASS (tsc --noEmit 0 errors)
pnpm test               # PASS (Vitest 7/7 tests pass)
pnpm build              # PASS (Next.js standalone build: 8 static routes)
```

## Milestone completion

1. ✅ Scaffold the application and install dependencies.
2. ✅ Implement typed domain/service boundary and demo fixtures.
3. ✅ Build the shell and complete the full deterministic demo journey.
4. ✅ Add tests, responsive layouts, and accessibility polish.
5. ✅ Fullscreen focus mode with ambient sound and quote overlays.
6. ✅ Implement `http-client.ts` for immediate plug-and-play backend integration via `.env`.
7. ✅ Run and verify all quality gates.
8. ✅ Clean repository hygiene and push to GitHub remote.
