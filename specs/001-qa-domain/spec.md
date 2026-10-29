---
spec_issue_number:
spec_issue_url:
status: in-progress # draft | ready | in-progress | done
branch: feature/boilerplate-migration
---

# QA domain on the boilerplate

## Clarifications

### Session 2026-10-29

- Q1: How does the boilerplate land in the QA repos? → A: new branch off `main`, boilerplate as the base, QA code ported on top.
- Q2: Is there data to migrate? → A: no, development only.
- Q3: How does the UI move? → A: full port to the boilerplate stack (TypeScript strict, Tailwind, `shared/ui`); Bootstrap, react-bootstrap, SweetAlert2 and Redux are dropped.
- Q4: What happens to SMS? → A: it stays optional; the API drops the phone step when `sms_enabled` is off, and this app follows `onboarding.currentStep`.

## Context

`qa-agent-web` was a plain-JS Vite SPA on Bootstrap and Redux, written before the `saas-setup` boilerplate existed. The boilerplate (React Router 8 SSR, TypeScript strict, Tailwind v4 design system, Apollo, OTP and Google sign-in, Playwright) is now the base; the QA features have to be rebuilt on it so the team keeps one set of conventions, one auth flow and one design system.

## Current State

After Phase 4 the app is the boilerplate with its demo domain removed and rebranded: roles are `user` and `super_admin`, onboarding is the name and phone steps, `/dashboard` is a placeholder, and there are no project, run or finding screens. The API (`qa-agent-backend`) exposes `allProjects`, `fetchProject`, `allScopeFeatures`, `allRuns`, `fetchRun`, `allFindings`, `fetchFindingsSummary`, `fetchCoverage`, `allRoleCredentials`, the GitHub queries and the mutations listed in its `schema.graphql`.

## Proposed Change

Port every QA screen onto nested routes under `/projects`, one query per tab instead of six tabs mounting at once.

```
/projects                       ProjectsPage
/projects/:projectId            ProjectLayout (header, tab nav) with children:
    index        Overview (GitHub, ClickUp)
    credentials  Credentials
    scope        Scope features
    runs         Runs (dispatch, queue)
    runs/:runId  Run detail
    issues       Issues
    issues/:id   Issue detail
    dashboard    Coverage and open issues
/github/callback                GithubCallbackPage
```

### Implementation Details

- One folder per feature under `app/features/` (`projects`, `project-overview`, `credentials`, `scope-features`, `github-integration`, `runs`, `findings`, `qa-dashboard`), each with a barrel, `types.ts`, `constants.ts`, `hooks/` and `components/`.
- Operations live in `app/graphql/{queries,mutations}/` named `<Verb><Noun>`; selections come from `app/graphql/fragments.ts`. Shapes are checked by hand against `qa-agent-backend/schema.graphql`.
- UI uses `shared/ui` only (Tabs, Table, Dialog, Tag, Stat, Progress, Card, Alert, EmptyState, Pagination, Skeleton, Link) and `FormInput` / `FormDropdown` with zod schemas in `shared/lib/schemas`.
- Admin-only controls render from `project.myRole`; the API enforces the same rules.

## Acceptance Criteria

1. WHEN a signed-in user opens `/projects` THE SYSTEM SHALL list the projects they belong to, newest first and paged, each with its GitHub status.
2. WHEN the user submits the New project dialog with a name and a web address THE SYSTEM SHALL create the project and open it.
3. IF the API rejects the project (invalid or private address) THEN THE SYSTEM SHALL show its message in the dialog and keep the form open.
4. WHEN the user opens a project THE SYSTEM SHALL show its header and tab navigation and load only the active tab's data.
5. WHILE the user is a plain member THE SYSTEM SHALL hide the controls only project admins may use.
6. WHEN an admin chooses Connect GitHub THE SYSTEM SHALL send them to GitHub, and on return finish the link, or let them choose between installations when there are several.
7. WHEN an admin saves a role credential THE SYSTEM SHALL never display the value again, only the role and when it was set.
8. WHEN an admin approves a scope feature THE SYSTEM SHALL show progress on that row only.
9. WHEN an admin dispatches a run THE SYSTEM SHALL add it to the queue and, WHILE any run is queued or running, refresh the list until none are.
10. WHEN the user opens a run THE SYSTEM SHALL show its summary, findings, endpoints, API log, memory and audit log.
11. WHEN the user opens Issues THE SYSTEM SHALL show one row per issue with severity, source, status and times seen, filterable by source, severity and category, and open one to see its evidence.
12. WHEN the user opens the dashboard THE SYSTEM SHALL show coverage and open-issue counts.
13. WHEN the user signs out THE SYSTEM SHALL clear cached data so the next user in the tab sees none of it.
14. Typecheck, lint and build pass.

## Testing Plan

| Layer       | What                                                               | Count |
| ----------- | ------------------------------------------------------------------ | ----- |
| Unit        | none (the app has no unit runner; logic stays thin and in hooks)   | 0     |
| Integration | API contract checked by hand against `schema.graphql`              | n/a   |
| E2E         | mocked-backend Playwright specs per flow (need an approved server) | 8     |

## Rollback Plan

The branch is separate from `main`; the old SPA is on `main` and in the git history.

## Effort Estimate

About 45 new files across 8 features, 20 operations and 8 e2e specs.

## Files Reference

| File                               | Change                                  |
| ---------------------------------- | --------------------------------------- |
| `app/routing/app.routes.ts`        | `/projects` tree and `/github/callback` |
| `app/shell/app/constants.ts`       | Projects navigation entry               |
| `app/features/<feature>/`          | New feature folders                     |
| `app/graphql/{queries,mutations}/` | New operations                          |
| `e2e/specs/projects/`              | New mocked specs                        |

## Out of Scope

- Changing the agent worker or the API contract it uses.
- Security headers and the Playwright run (Phase 6).

## Related

- `qa-agent-backend/docs/agent-contract.md`
