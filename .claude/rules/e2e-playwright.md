# E2E Tests (Playwright)

Specs state intent and assert. Page objects own every locator and action.

```
e2e/
  fixtures/        custom `test`, env helpers, saved-session paths
  page-object/     BasePage + one class per screen
  specs/<area>/    one spec per flow
  auth.setup.ts    signs in once and saves the session to e2e/.auth/
```

## Rules

- Import `test` and `expect` from `e2e/fixtures`, never from `@playwright/test`. New page objects are registered there.
- Locators and actions live in `page-object/`. A spec never calls `page.locator(...)` or `page.getByRole(...)` directly.
- Use `getByRole` and `getByLabel`. Use `data-testid` only when no accessible locator exists.
- Never use `waitForTimeout`. Assert with `expect(...)` so Playwright auto-waits.
- Put assertions the same screen needs again (`expectLoaded`, `expectInvalidEmail`) on its page object.
- Specs that need a signed-in user are named `*.authed.spec.ts` and use the saved session. Signed-out specs never touch it.
- Credentials and the OTP come from `.env.e2e` (`E2E_COADMIN_EMAIL`, `E2E_COADMIN_PASSWORD`, `E2E_OTP`). Never hardcode them. Add new names to `.env.e2e.example` without values.
- Refresh the saved session with `E2E_OTP=<code> npm run e2e:auth`. The OTP is single use, so a spec must never need one.
- Do not run specs against localhost, and do not start the dev server for them, without the user's approval (see the no-dev-server and no-localhost-preview rules).

## Mocked backend

Specs that need a user in a given role or setup state do not use a real account or OTP. They sign in through the real login and OTP screens with `session.signInAs(buildUser(role, overrides))`, which answers `LoginUser` and `ValidateOtp` through `mockGraphql` (`e2e/fixtures/graphql.ts`).

- Mock only what the page needs. An unmocked operation returns a plain GraphQL error, which shows a toast and does not end the session, and is listed in `unmocked`.
- Mock users must include every field the query selects, or Apollo logs "Missing field" warnings. `buildUser` already does.
- The app finishes sign-in with a full page navigation. `signInAs` waits for it, so a spec can call `appShell.open(...)` straight after.
- Mocked specs are plain `*.spec.ts` and run in the signed-out project. `*.authed.spec.ts` is only for the saved real session.
- Do not mock a response to hide a bug. Mark the case with `test.fixme(...)` and the reason, as `DOCUMENT_SIGNED_NOT_LOADED` does.

```ts
// ✅ GOOD
test('rejects an invalid email', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('not-an-email', 'x');
  await loginPage.expectInvalidEmail();
});

// ❌ NEVER
test('rejects an invalid email', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill('not-an-email');
  await page.waitForTimeout(500);
});
```
