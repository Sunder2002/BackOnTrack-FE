# BackOnTrack

BackOnTrack is a curriculum-grounded recovery planner for students who have temporarily fallen behind. It selects the next best block of learning from the student's current mastery, curriculum dependencies, assessment scope and available time—then recalculates the route when that state changes.

This repository contains the production-oriented frontend prototype built for the BITSOM Vertex Builders Pitch Fest. The working brand is centralized and replaceable.

## Demo scenario

Riya missed weeks 4–6 of Operating Systems. Her exam is Friday, and she has six hours to prepare. The main journey is:

1. Review the next best block and inspect why it was selected.
2. Enter the CPU Scheduling focus block.
3. Submit the sample mastery check, moving mastery from 38% to 72%.
4. Watch 18 minutes re-route to Deadlocks.
5. Change the study budget from six hours to three through the Ask screen.
6. Review the grounded sources and the privacy-conscious faculty view.

## Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 with product-specific design tokens
- Radix primitives for accessible dialogs, alert dialogs and progress
- Lucide icons
- Vitest and Testing Library
- pnpm with a committed lockfile

The versions were selected against the official Next.js, Tailwind, shadcn/Radix, Vitest, GitHub Actions and W3C guidance current when this prototype was built.

## Run locally

Requirements: Node.js 20+ and pnpm 11.19+.

```bash
# Copy sample environment configuration
cp .env.example .env.local

# Install dependencies and start development server
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000/student](http://localhost:3000/student) in your browser.

## Quality gates

```bash
pnpm format:check
pnpm lint --max-warnings=0
pnpm typecheck
pnpm test
pnpm build
```

The same gates run in GitHub Actions for pushes to `main` and for pull requests.

## Repository map

```text
src/
  app/                    Next.js App Router routes, metadata, and layouts
  components/             Modular, accessible React components
    app-shell/            Navigation bar, command palette, and layout framing
    ask/                  Intent-driven time budget adjustments
    brand/                Consistent branding & visual identity
    faculty/              Privacy-conscious professor overview
    focus/                Fullscreen distraction-free session with ambient sound
    mastery/              Topic mastery visualizer and progress audit
    overview/             Student overview, urgent nudges, and next best block
    plan/                 Dynamic study block sequence and rerouting panel
    sources/              Curriculum syllabus, lecture, and rubric grounding
    ui/                   Accessible primitives (Radix-backed)
  config/                 Centralized brand identity and copy
  data/demo/              Deterministic demo fixtures
  services/api/           Typed API layer: client, mock client, and HTTP client
  state/                  Global application state & reactive recalculation
  test/                   End-to-end user flow interaction tests
public/                   Static assets, icons, and metadata
.github/workflows/        Automated GitHub Actions CI quality gates
docs/                     Architecture specifications and deployment guides
SOUL.md                   Durable product vision and continuity document
```

## Backend integration

The frontend is architected with a strict service interface (`LearningApi` in `src/services/api/types.ts`). By default, the application runs against `mockLearningApi`.

To connect to a live backend (FastAPI, Go, Node.js, Spring Boot, etc.):

1. In your `.env` or `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
   NEXT_PUBLIC_DEMO_MODE=false
   ```
2. The client in `src/services/api/client.ts` automatically delegates all requests to `src/services/api/http-client.ts`, which sends standard JSON requests to the endpoints documented in `docs/architecture.md`.

No component code requires changes when connecting a backend.

## Keyboard and accessibility

- `S`: start the current learning block when focus is outside an input
- `P`: open the current plan
- `?`: open keyboard shortcuts
- `Cmd/Ctrl + K`: open the command palette
- `Esc`: close context first; while actively studying, open the honest exit dialog

Core controls have visible focus indicators, comfortable targets, semantic landmarks, text labels in addition to color, accessible dialog primitives and reduced-motion behavior.

## Deployment

The standard `pnpm build` output can be deployed to any supported Next.js host. `output: "standalone"` and the included multi-stage `Dockerfile` provide a portable production container path. See [docs/deployment.md](docs/deployment.md) for the release checklist.

## Working-brand continuity

Read `SOUL.md` before continuing work. It records the product north star, canonical demo, design thesis, current milestone and next actions so the project can resume safely after an interrupted session.
