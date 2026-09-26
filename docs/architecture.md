# Frontend architecture

## Design goal

The interface makes one decision legible: what Riya should learn next, why, and how that decision changes as her state changes. Product surfaces therefore depend on typed learning-domain data rather than embedding fixture rules inside presentation components.

## Data flow

```text
Approved course inputs + student state
                 ↓
        LearningApi interface
                 ↓
      DemoProvider route state
                 ↓
  Overview / Focus / Plan / Ask / Mastery
```

`src/services/api/types.ts` is the contract. `mock-client.ts` is the deterministic offline implementation, and `http-client.ts` is the production fetch client. `client.ts` is the composition point that dynamically switches between them based on `NEXT_PUBLIC_DEMO_MODE` in `.env`.

## State ownership

`DemoProvider` owns only the cross-route state required for the pitch: study budget, mastery update, active recovery plan and last plan change. Local overlay, field and step state stays inside the relevant screen. This prevents UI concerns from leaking into the future server contract.

## Route responsibilities

- `/student`: recommendation, readiness context, route and deprioritized topics.
- `/student/focus`: distraction-minimal lesson block, honest exit handling and mastery submission.
- `/student/plan`: current allocation and inspectable plan changes.
- `/student/mastery`: topic estimates and latest mastery movement.
- `/student/ask`: structured plan input instead of an ungrounded chat transcript.
- `/student/sources`: provenance and curriculum coverage.
- `/faculty`: aggregate gaps and suggested intervention without student ranking.

## Resilience and trust

- Demo outcomes are deterministic and resettable.
- Loading and route-error states preserve the previous-plan message.
- Recommendations expose source evidence.
- `verified` is intentionally represented as approved demo data, not external certification.
- Security response headers are configured globally.
- No browser behavior is claimed unless the browser API can actually observe it.
