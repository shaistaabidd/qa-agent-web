# specs/

This folder holds a spec for every non-trivial feature — either a single
`specs/<NNN>-<slug>.md` file (Lite) or a `specs/<NNN>-<slug>/` folder
(Full) — committed to git. The short version of the rule is always loaded
(`.claude/rules/spec-driven-development.md`, mirrored at
`.cursor/rules/spec-driven-development.mdc`); the full workflow
(`*-detail.md`/`.mdc`) loads automatically once a file under `specs/` is in
play, so it costs nothing on sessions that never touch a spec.

## Which tier

**Lite** (default): one user-facing flow, 2-4 files, no auth/payments/
billing/data-model/migration changes, no new dependency, one PR. **Full**:
2+ flows, 5+ files, touches auth/payments/billing/data model or migrations,
a new dependency, or multiple PRs. Grows past Lite mid-build? Stop and
convert to Full rather than stretch it.

## Quick version — Lite

1. Run `/spec`, file the issue, then write `specs/<NNN>-<slug>.md` from
   `specs/_template/lite-spec.md`: Context, EARS Acceptance Criteria, Files
   Reference, Out of Scope, a "Done When" checklist.
2. Build it (`tdd` skill + the usual `.claude/rules/*`), writing the
   `e2e/specs/<area>/*.spec.ts` alongside the code, not after.
3. `npm run e2e`, a quick manual console check, `/review`, `/ship`. Every
   "Done When" box checked before shipping.
4. After merge: `git mv specs/<NNN>-<slug>.md specs/_archive/<NNN>-<slug>.md`.

## Quick version — Full

1. Run `/spec` to interrogate the request and file a GitHub issue.
2. Copy the issue body into `specs/<NNN>-<slug>/spec.md` (start from
   `specs/_template/`). `NNN` is the next number after the highest one
   already in this folder.
3. Run `/plan-eng-review` (and `/plan-design-review` for UI work), record the
   result in `plan.md`, including its Release Gate table and an empty
   Requirement Traceability table.
4. Break the work into checkboxes in `tasks.md`, one "Flow" subsection per
   user-facing flow, each with Dev Notes citing `plan.md`/`spec.md`. Then run
   the Specify Quality Pass — Clarify (≤5 numbered questions, logged under
   `spec.md`'s `## Clarifications`) followed by Analyze (a read-only
   consistency check across spec/plan/tasks/rules), one read instead of two
   — before Build starts.
5. Build it (`tdd` skill + the usual `.claude/rules/*`). For each flow, write
   its `e2e/specs/<area>/*.spec.ts` side by side with the implementation —
   not deferred. Check off `tasks.md` as you go and append dated entries to
   `plan.md`'s Delivery Log as evidence lands.
6. Before `/ship`: `npm run e2e`, then one deep regression pass with the
   `browser-regression-testing` skill against every flow (console, leak
   check, performance, break-it inputs — needs the user's go-ahead to start
   the dev server), then `/review`. Confirm every Release Gate in `plan.md`
   is `passed` or `waived`, the Requirement Traceability table is filled in,
   and every Acceptance Criterion in `spec.md` has a Delivery Log entry
   evidencing it.
7. After merge: `git mv specs/<NNN>-<slug>/ specs/_archive/<NNN>-<slug>/`. If
   you forget, the next `git pull` reminds you — it flags any spec file or
   folder whose branch no longer exists.

## What's in here right now

Each `NNN-slug.md` file or `NNN-slug/` folder is one feature's spec.
Features built before this convention existed (everything under
`app/features/` as of October 2026) do not have one here — SDD applies to
new work only.

## Enforcement

Soft convention, not CI-enforced, as of October 2026. The PR template nudges
toward linking a spec; nothing fails the build if you skip it. See
"Future CI enforcement" below for the planned (not-yet-built) check.

## Future CI enforcement (not implemented yet)

Once a handful of features have gone through this workflow, a non-blocking
check can be added to `.github/workflows/ci.yml`: a new step in the existing
`check` job that reads the PR's branch name, derives its slug, checks whether
a `specs/<NNN>-<slug>/` folder exists for it, and if `tasks.md` exists, counts
unchecked `- [ ]` boxes. It reports both as `::warning::` annotations — it
does not set a failing exit code. Only after the team has lived with the
convention for a while and agreed it's not noisy should that warning become a
required, failing check.
