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

Requirements: Node.js 24+ and pnpm 11.19+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000/student](http://localhost:3000/student).

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
  app/                    Next.js routes, metadata and route-level states
  components/             Product surfaces grouped by responsibility
  config/brand.ts         Central working brand, proposition and theme identity
  data/demo/              Deterministic pitch fixtures only
  services/api/           Typed backend boundary and swappable mock client
  state/                  Cross-route deterministic demo state
  test/                   Interaction-level demo flow tests
public/                   Local brand assets
.github/workflows/        Reproducible CI quality gates
docs/                     Architecture and deployment notes
SOUL.md                   Durable work-continuation and product memory
```

## API boundary

UI components consume `LearningApi` from `src/services/api/types.ts`. The current binding in `src/services/api/client.ts` points to a deterministic mock client. A future HTTP client can implement the same interface and replace that binding without moving fixture logic into React components.

No demo fixture is represented as production AI. Source labels explicitly mean “approved in the demo dataset,” not external certification.

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
