---
status: draft # draft | eng-reviewed | design-reviewed | approved | delivered
---

# Plan: <Feature title>

## Approach

[The technical approach chosen. One or two paragraphs — not a restatement of
spec.md's Implementation Details, but the reasoning behind choosing it.]

## Alternatives Considered

| Option | Why not chosen |
| ------ | -------------- |

## Architecture / Data Model Notes

[Anything beyond what spec.md already specifies — sequencing across files,
migration order, API contract decisions, state management choices.]

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |

## Review Sign-off

| Review                         | Reviewer | Verdict | Date | Notes                                     |
| ------------------------------ | -------- | ------- | ---- | ----------------------------------------- |
| Eng (`/plan-eng-review`)       |          |         |      |                                           |
| Design (`/plan-design-review`) |          |         |      | (omit row if no UI/design-system surface) |

## Dependencies & Sequencing

[What must land before this, what this blocks, in what order within this
feature if it spans multiple PRs.]

## Open Questions

- [ ] [anything still unresolved before implementation starts]

## Release Gate

Define every gate this feature must clear before it ships — write this
section before Build starts, even though nothing can be `passed` yet. A gate
moves to `passed` (evidence linked or quoted in the Delivery Log below) or
`waived` (one-line reason) — never deleted once named.

| Gate                                                            | Status  | Evidence | Date |
| --------------------------------------------------------------- | ------- | -------- | ---- |
| All Acceptance Criteria met                                     | pending |          |      |
| No regression in existing functionality                         | pending |          |      |
| Deep regression pass clean (console/leak/perf — see `tasks.md`) | pending |          |      |
| [feature-specific gate]                                         | pending |          |      |

## Requirement Traceability

One row per Acceptance Criterion in `spec.md`. Fill in as each flow's e2e
spec lands — the Delivery Log entries below cite this table as evidence,
not the other way around.

| AC# | e2e test                          | Result  | Date |
| --- | --------------------------------- | ------- | ---- |
| AC1 | `e2e/specs/<area>/<flow>.spec.ts` | pending |      |

## Delivery Log

Append-only — add a dated entry each time something material happens during
Implement, Verify, or Ship. Don't rewrite earlier entries; add to them. This
is what closes the loop: the evidence that an Acceptance Criterion was met
lives in the same document as the criterion itself, not just implied by a
merged PR nobody reopens.

### <YYYY-MM-DD> — <what happened>

[What was verified, what broke and got fixed, QA/e2e results, which
Acceptance Criterion (AC#) in spec.md this evidences. Quote the actual test
output or reviewer sign-off where it matters — don't paraphrase it away.]

---

Before `/ship`: every Release Gate row above is `passed` or `waived`, and
every Acceptance Criterion in `spec.md` has at least one Delivery Log entry
evidencing it.
