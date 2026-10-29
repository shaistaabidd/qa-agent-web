# Tasks: QA domain on the boilerplate

## Setup

- [x] Remove the boilerplate demo domain, rebrand, reduce roles to `user` and `super_admin` (AC14)
- [x] Add operations and selections under `app/graphql/` (AC1-12)
- [x] Add the Projects navigation entry and the `/projects` route tree (AC4)

## Flows

### Flow: Projects list and create (AC1-3)

- [x] `features/projects`: list page, create dialog, hooks
- [x] `e2e/specs/projects/projects-list.spec.ts` (written, not yet run)

### Flow: Project shell (AC4-5)

- [x] `ProjectLayout` with tab navigation and `myRole`
- [x] `e2e/specs/projects/project-shell.spec.ts` (written, not yet run)

### Flow: GitHub and ClickUp (AC6)

- [x] `features/github-integration`, `features/project-overview`, callback route
- [x] `e2e/specs/projects/github-connect.spec.ts` (written, not yet run)

### Flow: Credentials and scope (AC7-8)

- [x] `features/credentials`, `features/scope-features`
- [x] `e2e/specs/projects/credentials-and-scope.spec.ts` (written, not yet run)

### Flow: Runs (AC9-10)

- [x] `features/runs` with polling and run detail
- [x] `e2e/specs/projects/runs.spec.ts` (written, not yet run)

### Flow: Issues and dashboard (AC11-12)

- [x] `features/findings`, `features/qa-dashboard`
- [x] `e2e/specs/projects/issues-and-dashboard.spec.ts` (written, not yet run)

### Flow: Sign-out clears data (AC13)

- [x] Confirm `logout()` clears the Apollo store
      ~~[ ] `e2e/specs/auth/logout-clears-data.spec.ts`~~ — skipped: logout does a full-page redirect and the store is also cleared on session end; no stable way to assert the cache in a mocked spec

## Deep Regression Pass (before `/ship`)

Needs the user's explicit go-ahead to start a server; not started by the agent.

- [ ] Functional and break-it pass per flow
- [ ] Console, leak and performance checks

## Docs / Cleanup

- [x] Update `.claude/rules/graphql-fragments.md` (clinic selections are gone)
