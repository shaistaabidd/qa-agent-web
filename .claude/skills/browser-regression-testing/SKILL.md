---
name: browser-regression-testing
description: Run deep regression and break-it testing of this app in a visible browser (Playwright headed Chrome), with screenshots and a pass/fail summary. Use when the user asks to test, verify, regression-test, QA, or "try to break" UI changes on localhost.
---

# Browser Regression Testing

Use only after the user has confirmed testing on localhost (see the no-localhost-preview and no-dev-server rules). The dev server is already running at `http://localhost:5173`. Never start or restart it.

## Setup

- Scripts and screenshots live in the session scratchpad, never in the repo.
- Install `playwright-core` in the scratchpad (`npm i playwright-core`), not in the project. Do not touch the project `package.json`.
- Launch visible Chrome: `chromium.launch({ channel: 'chrome', headless: false, slowMo: 120 })`. The user must be able to watch.
- Also run WebKit headed (`webkit.launch({ headless: false })`) for engine-specific checks. Firefox may not launch; report that instead of hiding it.
- Use a small `lib.mjs` with `launch()`, `check(suite, name, pass, detail)`, `shot(page, name, locator?)`, and a console/pageerror collector. One script per area (`t1.mjs`, `t2.mjs`, ...).

## Where to test

- Shared UI: the design-system page, `/design-system#<section-id>`. Sections are listed in `app/features/design-system/constants.ts`.
- If a case has no demo (stacking, edge values, form reset), add a small demo `Example` to the matching section under `app/features/design-system/components/sections/` instead of faking DOM from the test. Keep those demos.
- Logged-in screens: log in at `/login`. The password step is followed by a 2FA code at `/otp`. Ask the user for the code, never guess it, and keep the browser open while waiting. Save `storageState` after login and reuse it.
- Each login sends a new code and invalidates the previous one, and the pending-login state is lost when the browser closes. Log in once, keep that visible browser open on `/otp`, poll a scratchpad file (`otp.txt`) for the code, then save `storageState`. Ask the user for the newest code only after the page is waiting.
- The app talks to a real staging API. Simulate failures by aborting requests in the browser (`page.route(url, r => r.abort())`), never by changing data.
- Never read `.env` or secret files. Use only credentials the user gives in chat.

## What to cover for every change

1. Functional: each changed behavior, plus its inverse (the thing that must not change).
2. Break it: invalid, empty, huge, and mixed input; rapid repeat; double click; Escape spam; open/close x40; unmount mid-interaction.
3. Keyboard only: Tab, Shift+Tab, arrows, Home, End, Escape, Enter, Space.
4. Accessibility: roles, names, `aria-*`, live regions, focus return, `inert`. Check the DOM, not only visuals.
5. Layout: 320px mobile viewport (no horizontal overflow), 200% zoom, shrink-to-fit parents, long text.
6. Leak check: after stress, `document.body` style, `[inert]` count (compare to a baseline), portals, scroll position, `pointer-events`.
7. Performance: `PerformanceObserver` `longtask` during drags, typing, and large pastes.
8. Console: zero new errors or warnings.
9. Cross-engine: Chrome and WebKit.

## Pitfalls seen before

- macOS: `Control+A` moves the caret. Use `Meta+a` to select all.
- Navigating to the same URL with only a hash does not reload. Use `page.reload()` to reset state.
- Scroll the element into view before using raw `page.mouse` coordinates, or the mouse hits `<html>`.
- A synthetic `paste` needs a real `ClipboardEvent` with a `DataTransfer`.
- Playwright `getByRole` does not treat `inert` as hidden. Check `closest('[inert]')`.
- Closed accordion panels are `inert`, so the page has a nonzero baseline `[inert]` count.
- File inputs are single-select, so `setInputFiles` with two files throws. Test multi-file through a `drop` event.
- A double click on a dialog trigger closes the dialog, because the overlay covers the trigger. That is expected.
- Uploaders with no `onUpload` prop send a real request and show "Upload failed". Pick the demo that simulates the upload.

## Report

Finish with a summary table per area (pass/fail counts), each bug with cause, screenshot path, and fix status, then what was not tested (real devices, screen readers, engines that would not launch). Distinguish a real bug from a test-script mistake. Follow the ask-followup-questions rule at the end.
