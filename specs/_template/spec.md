---
spec_issue_number:
spec_issue_url:
status: draft # draft | ready | in-progress | done
branch:
---

# <Feature title>

## Clarifications

Before this spec's `status` moves past `draft`, resolve ambiguity with at
most 5 numbered questions, asked one at a time — not batched. For each:
state why it matters, then either a short list of options with a
recommended default, or a single short-answer prompt. Append the answer
immediately under the session heading below; save after each one instead of
waiting for all five.

### Session <YYYY-MM-DD>

- Q1: [question] → A: [answer]

## Context

[2-3 sentences: what exists today, why it's insufficient, why now. Frame from
the stakeholder perspective — who is affected and why they care.]

## Current State

[Verified description of current behavior. Audit table if this affects one
member of a family. File paths and line numbers. Verification date if state
could drift.]

## Proposed Change

[What changes. Architecture diagram if helpful.]

### Implementation Details

[Specific files, schemas, API shapes, patterns to follow. Zero design
decisions left for the implementer.]

## Acceptance Criteria

Write each criterion in EARS notation (Easy Approach to Requirements
Syntax) — a trigger plus an observable response, so it stays testable
instead of becoming a vibe.

| Pattern           | Form                                                   | Use when                    |
| ----------------- | ------------------------------------------------------ | --------------------------- |
| Ubiquitous        | THE SYSTEM SHALL [response]                            | Always true, no trigger     |
| Event-driven      | WHEN [trigger] THE SYSTEM SHALL [response]             | A specific action causes it |
| State-driven      | WHILE [state] THE SYSTEM SHALL [response]              | True only during a state    |
| Unwanted behavior | IF [condition] THEN THE SYSTEM SHALL [response]        | Error/edge case handling    |
| Optional feature  | WHERE [feature is enabled] THE SYSTEM SHALL [response] | Feature-flagged behavior    |

1. WHEN [trigger] THE SYSTEM SHALL [specific, pass/fail, observable response]
2. IF [edge case] THEN THE SYSTEM SHALL [specific handling]
3. Tests written and passing
4. No degradation of existing functionality

## Testing Plan

| Layer       | What | Count |
| ----------- | ---- | ----- |
| Unit        |      |       |
| Integration |      |       |
| E2E         |      |       |

## Rollback Plan

[How to undo if something goes wrong]

## Effort Estimate

[Per-component breakdown]

## Files Reference

| File                | Change            |
| ------------------- | ----------------- |
| `path/to/file:line` | What changes here |

## Out of Scope

- [Thing that seems related but is NOT part of this spec]

## Related

- #NNN — the companion GitHub issue filed by /spec
