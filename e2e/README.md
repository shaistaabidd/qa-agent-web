# End-to-end tests

Playwright tests for the app. Conventions for writing them live in
`.claude/rules/e2e-playwright.md` (and the Cursor copy). This page is for running them.

## Run them

Start the dev server yourself (`npm run dev`), then:

```bash
npm run e2e                                  # everything
npx playwright test --project=chromium       # signed-out and mocked specs only
npx playwright test specs/admin/co-admins    # one spec
npm run e2e:ui                               # Playwright UI mode
```

First time on a machine: `npx playwright install chromium`.

The config reads `E2E_BASE_URL` (default `http://localhost:5173`). If the server is not already
running and `E2E_BASE_URL` is unset, Playwright starts `npm run dev` for you.

## Three kinds of spec

| Kind           | File name          | Backend           | Needs                    |
| -------------- | ------------------ | ----------------- | ------------------------ |
| Signed out     | `*.spec.ts`        | Real or mocked    | Nothing                  |
| Mocked sign-in | `*.spec.ts`        | **Mocked**        | Nothing                  |
| Real session   | `*.authed.spec.ts` | Your real backend | A saved co-admin session |

Most specs are the first two and run anywhere. They sign in through the real login and OTP
screens with the GraphQL answers mocked (`fixtures/graphql.ts`, `fixtures/session.ts`), so they can
be any role in any setup state and never touch real data or need an OTP.

```ts
await session.signInAs(buildUser('client', { documentSigned: false }), {
  UpdateUser: () => ({ updateUser: { user: buildUser('client') } }),
});
```

An operation you do not mock returns a plain GraphQL error (a toast, not a logout) and is listed in
`mock.unmocked`. `mock.callsTo('Operation')` returns what the app sent, so a test can assert the
request, not only the screen.

## Real-session specs

These use your real co-admin account and only read: they never change data.

1. Copy `.env.e2e.example` to `.env.e2e` and fill in the co-admin email and password.
   `.env.e2e` is gitignored. Do not commit it.
2. Ask the app for an OTP on the login screen, then run it within its lifetime:

   ```bash
   E2E_OTP=<code> npm run e2e:auth
   ```

   This signs in once and saves the session to `e2e/.auth/` (gitignored).

3. Run `npm run e2e`. Without a saved session these specs skip themselves.

The OTP is single use. A spec must never need one: only `auth.setup.ts` does.

## Skips

The real-session specs skip themselves when no session has been saved.

Some cases are marked `test.fixme` because the app changed under them. They run again when you
remove the line, and each one carries its reason:

- **Legacy roles** (`team_member`, `client`, `practitioner`, `super_clinic_admin`): the login query no
  longer selects `onboardingCompleted`, `subscriptionPaid`, `documentSigned` or `calendarLink`, so
  these roles are sent to `/profile-setup`. The shared reason is in `fixtures/legacyRoles.ts`. This
  covers pricing, payment result, sign document, add calendar and parts of the role and routing specs.
- **Impersonation**: the co-admin row menu has no Impersonate action.
- **Client profile setup**: it saves nothing and returns to `/profile-setup`.

Only `super_admin` and `user` can sign in and reach the app today, so mocked specs use those roles.

When a test finds a bug you cannot fix yet, mark the case with `test.fixme(condition, reason)` so the
reason is in the report and the test runs again the moment you remove the line. Do not loosen the
assertion to make it pass.

## Layout

```
e2e/
  fixtures/      custom test, GraphQL mock, mock users and clinics, saved-session paths
  page-object/   one class per screen; all locators and actions live here
  specs/<area>/  one spec per flow
  auth.setup.ts  signs in once for the real-session specs
```

Specs import `test` and `expect` from `fixtures`, never from `@playwright/test`, and never call
`page.locator(...)` themselves.

## Safety nets

- An uncaught error in the page fails the test, even when every assertion passes (`fixtures/index.ts`).
- Mock users and clinics must carry every field the query selects. Apollo logs "Missing field"
  errors otherwise, which hides real warnings.

## Things that bite

- **Hidden inputs.** The checkbox and switch inputs sit under a styled label that blocks clicks.
  Click the label (`SignDocumentPage.agree`, `AdminListPage.toggleAccess`), not `check()`.
- **Tables rebuild once after load.** Use `expectRowsSettled()` before touching a row menu or switch.
- **A click right after a dialog closes can be swallowed.** `openRowMenu` retries until the menu opens.
- **Mock users need `__typename`.** Without it a saved change never reaches the page. `buildUser`
  includes it.
- **Sign-in ends with a full page navigation.** `signInAs` waits for it, so call `open(...)` right after.
