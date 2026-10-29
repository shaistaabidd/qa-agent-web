# Tasks: <Feature title>

Each item references the Acceptance Criterion (AC#) or Testing Plan row it
satisfies. Check items off as they land — don't batch-complete at the end.

## Setup

- [ ] [task] (AC#)

## Flows

One subsection per user-facing flow. Build its Playwright spec side by side
with the implementation — not deferred to a separate pass at the end. An
`IF <condition> THEN THE SYSTEM SHALL <response>` (EARS "unwanted behavior")
criterion gets its own flow entry exercising that failure path, same as a
happy-path `WHEN` criterion — error handling is tested, not assumed.

### Flow: <flow name> (AC#)

**Dev Notes** — only what's extracted from `spec.md`/`plan.md`; cite
`[Source: plan.md#section]` for every technical claim, or write "No
specific guidance found." Carry forward anything the previous flow's
implementation revealed.

- File refs: [paths]
- Technical constraints: [...] `[Source: plan.md#section]`
- Notes from previous flow: [...] (omit on the first flow)

- [ ] Implement [specific change]
- [ ] `e2e/specs/<area>/<flow>.spec.ts` — [specific scenario, incl. the
      error path if this flow covers an IF/THEN criterion]
- [ ] Test strategy: [unit / e2e / both, and why]

### Flow: <flow name> (AC#)

**Dev Notes** — `[Source: plan.md#section]` citations; carry forward
notes from the previous flow.

- File refs: [paths]
- Technical constraints: [...] `[Source: plan.md#section]`
- Notes from previous flow: [...]

- [ ] Implement [specific change]
- [ ] `e2e/specs/<area>/<flow>.spec.ts` — [specific scenario]
- [ ] Test strategy: [unit / e2e / both, and why]

## Other Tests

- [ ] Unit: [specific test] (Testing Plan row)
- [ ] Integration: [specific test] (Testing Plan row)

## Deep Regression Pass (before `/ship`)

Needs the user's explicit go-ahead to start the dev server / open localhost
per `no-dev-server.md` and `no-localhost-preview.md` — never start it
yourself. Run the `browser-regression-testing` skill against every flow
above, then log the findings as a Delivery Log entry in `plan.md`.

- [ ] Functional pass + inverse (the thing that must NOT change) per flow
- [ ] Break-it pass: invalid/empty/huge/mixed input, rapid repeat, double
      click, keyboard-only
- [ ] Console: zero new errors or warnings
- [ ] Leak check: inert count, portals, scroll position, pointer-events
      clean after stress
- [ ] Performance: no new long tasks during drags/typing/large pastes
- [ ] Findings (bugs found+fixed, screenshots, what wasn't tested) logged
      in `plan.md`'s Delivery Log

## Docs / Cleanup

- [ ] [task]

---

If a task turns out unnecessary, strike it through with a one-line reason
instead of deleting it: `~~[ ] task~~ — skipped: reason`.
