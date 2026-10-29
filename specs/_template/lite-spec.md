---
spec_issue_number:
spec_issue_url:
status: draft # draft | ready | in-progress | done
branch:
tier: lite
---

# <Feature title>

## Context

[1-2 sentences: what exists today, why it's insufficient, why now.]

## Acceptance Criteria

Write each criterion in EARS notation — a trigger plus an observable
response. See `specs/_template/spec.md` for the full pattern table if you
need WHILE/WHERE; the two forms below cover most Lite specs.

1. WHEN [trigger] THE SYSTEM SHALL [specific, pass/fail, observable response]
2. IF [edge case] THEN THE SYSTEM SHALL [specific handling]

## Files Reference

| File                | Change            |
| ------------------- | ----------------- |
| `path/to/file:line` | What changes here |

## Out of Scope

- [Thing that seems related but is NOT part of this spec]

## Done When

- [ ] Every Acceptance Criterion above is met
- [ ] `e2e/specs/<area>/<flow>.spec.ts` covers the flow, including the
      IF/THEN path if there is one
- [ ] `npm run e2e` passes
- [ ] Quick manual check: no new console errors in the flow you touched
- [ ] PR description links this file

## Related

- #NNN — the companion GitHub issue filed by /spec

---

If this grows past Lite's bounds mid-build (a second flow, a 5th file, or it
turns out to touch auth/payments/billing/data model) — stop, create the Full
`specs/<NNN>-<slug>/` folder from `specs/_template/`, move what's useful from
this file into `spec.md`, and continue there. Don't keep stretching a Lite
spec past what it was built for.
