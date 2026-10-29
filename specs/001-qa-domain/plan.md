---
status: approved # draft | eng-reviewed | design-reviewed | approved | delivered
---

# Plan: QA domain on the boilerplate

## Approach

Rebuild each QA screen with the boilerplate's own pieces rather than restyling the old components. Tabs become nested routes so each tab loads its own data, lists use URL state (`nuqs`) like the email log, and detail pages are real routes rather than expanding table rows, so they can be linked and opened in a new tab.

## Alternatives Considered

| Option                                  | Why not chosen                                            |
| --------------------------------------- | --------------------------------------------------------- |
| Keep Bootstrap for the QA pages         | Two design systems and a larger bundle; rejected up front |
| Keep tabs in component state            | All panes mounted at once (24 requests); not linkable     |
| Expanding rows for run and issue detail | Not linkable; a very tall table row                       |

## Architecture / Data Model Notes

Polling uses Apollo `pollInterval` only while a run is queued or running. Issue evidence (`details`) is free-form JSON from the worker, so each section renders only the keys it finds. No new `shared/ui` primitive is added; gaps are composed from existing ones or reported.

## Risks & Mitigations

| Risk                                           | Likelihood | Mitigation                                                |
| ---------------------------------------------- | ---------- | --------------------------------------------------------- |
| API field renamed after the port               | Medium     | Operations checked against the committed `schema.graphql` |
| A needed primitive is missing from `shared/ui` | Low        | Compose existing ones; ask before adding                  |
| Large detail components break file-size rules  | Medium     | One component per evidence section, each under 100 lines  |

## Review Sign-off

| Review                   | Reviewer | Verdict  | Date       | Notes                          |
| ------------------------ | -------- | -------- | ---------- | ------------------------------ |
| Eng (`/plan-eng-review`) | user     | approved | 2026-10-29 | Approved as the migration plan |

## Dependencies & Sequencing

Needs `qa-agent-backend` Phase 2 and 3 (schema, agent contract). Blocks Phase 6 (headers, e2e run) and Phase 7 (worker end to end).

## Open Questions

- [ ] Approval to start a server so the Playwright specs can run.

## Release Gate

| Gate                                    | Status  | Evidence                                    | Date |
| --------------------------------------- | ------- | ------------------------------------------- | ---- |
| All Acceptance Criteria met             | pending |                                             |      |
| No regression in existing functionality | pending |                                             |      |
| Deep regression pass clean              | pending | needs the user's go-ahead to start a server |      |

## Requirement Traceability

| AC#     | e2e test                                           | Result           | Date |
| ------- | -------------------------------------------------- | ---------------- | ---- |
| AC1     | `e2e/specs/projects/projects-list.spec.ts`         | written, not run |      |
| AC2-3   | `e2e/specs/projects/projects-list.spec.ts`         | written, not run |      |
| AC4-5   | `e2e/specs/projects/project-shell.spec.ts`         | written, not run |      |
| AC6     | `e2e/specs/projects/github-connect.spec.ts`        | written, not run |      |
| AC7-8   | `e2e/specs/projects/credentials-and-scope.spec.ts` | written, not run |      |
| AC9-10  | `e2e/specs/projects/runs.spec.ts`                  | written, not run |      |
| AC11-12 | `e2e/specs/projects/issues-and-dashboard.spec.ts`  | written, not run |      |
| AC13    | none (see tasks.md)                                | n/a              |      |

## Delivery Log

### 2026-10-29 — security headers

Added enforced hardening headers and a report-only strict CSP with a per-request nonce (`app/entry.server.tsx`, `app/shared/lib/securityHeaders.ts`). The strict policy is report-only on purpose: it could not be exercised in a browser without starting the app, so it should be watched on a real page before it is enforced. `e2e/specs/shell/security-headers.spec.ts` covers the headers (not yet run).

### 2026-10-29 — implemented

All eight features, 21 operations and seven mocked specs written. Typecheck, lint and build pass, and every operation validates against `qa-agent-backend/schema.graphql`. The Playwright specs have not been run: that needs a server started, which the repo's rules reserve for the user. The API gained `fetchFinding` for the issue page.

### 2026-10-29 — spec written

Spec, plan and tasks created from the approved migration plan before Phase 5 code.
