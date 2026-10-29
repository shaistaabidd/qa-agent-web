# qa-agent-web

Web app for the QA Agent: connect an app's GitHub repo, approve what to test, store test credentials, run the Playwright worker, and review the issues it finds. It talks to `qa-agent-backend` over GraphQL.

Built on the `saas-setup` boilerplate: React Router 8 (framework mode, SSR), React 19, TypeScript strict, Tailwind v4 with the in-repo design system (`app/shared/ui`), Apollo Client, zustand, TanStack Form and zod, Playwright.

## Run

```bash
npm install --legacy-peer-deps   # --legacy-peer-deps is required (see .npmrc)
cp .env.example .env             # set VITE_APP_API_URL to the API, e.g. http://localhost:3001
npm run dev
```

| Script                            | What it does                      |
| --------------------------------- | --------------------------------- |
| `npm run typecheck`               | `react-router typegen` then `tsc` |
| `npm run lint` / `npm run format` | ESLint / Prettier check           |
| `npm run build` / `npm run start` | Production build / serve it (SSR) |
| `npm run e2e`                     | Playwright (see `e2e/README.md`)  |

Husky runs lint-staged on commit and `typecheck` on push.

## Environment

| Variable           | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `VITE_APP_API_URL` | Base URL of `qa-agent-backend`; the app posts GraphQL to `/graphql` |

Vite inlines `VITE_*` values at build time, so set them in the build environment (including Docker and Heroku).

## Layout

```
app/
  routes.ts, routing/*.routes.ts   route config, one file per group
  routes/                          thin route modules: meta() + a feature page
  features/<name>/                 one folder per feature (page, components/, hooks/, types.ts)
  shell/                           root, auth and app layouts, sidebar, error boundaries
  shared/ui, shared/lib            design-system primitives and shared helpers
  providers/apollo                 Apollo client, links, central error handling
  graphql/                         operations and shared selections (fragments.ts)
e2e/                               Playwright specs, page objects and a mocked GraphQL backend
specs/                             spec-driven-development templates
```

Project rules live in `.claude/rules` (mirrored in `.cursor/rules`): feature folders, reuse of `shared/ui`, design tokens, GraphQL operation naming, and e2e conventions.

## Auth and access

Sign-in is the boilerplate's: email and password, then a one-time code, or Google. The session token lives in `react-secure-storage`, a `storage` listener signs out other tabs, and a 401 or `UNAUTHENTICATED` response ends the session. Route guards (`requireAuth`, `requireRoles`, `requireGuest`, `requireSetup`) run in `clientLoader`, so a protected page shows a loading screen until the app hydrates; the API enforces all authorization.

Roles are the API's: `user` and `super_admin`. Super admins also get the email log, SMS log and user-management pages.

## Security headers

`app/entry.server.tsx` adds them to every HTML response (`app/shared/lib/securityHeaders.ts`).

- **Enforced:** `frame-ancestors 'none'` and `X-Frame-Options: DENY`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, HSTS, `nosniff`, a referrer policy and a permissions policy.
- **Report only:** a strict policy that limits scripts to this origin and a per-request nonce (`NonceContext`, passed to `ServerRouter`, `Scripts` and the theme script), and limits `connect-src` to this origin and `VITE_APP_API_URL`. Open the browser console on a real page and look for `[Report Only]` messages. When there are none, move its directives into `Content-Security-Policy`.

Route guards run in `clientLoader`, so a protected page shows a loading screen until the app hydrates. The API enforces all authorization, so this only affects what flashes on screen.

## Deploy

`Dockerfile` builds the SSR app (`npm run build`) and serves it with `react-router-serve`, which reads `PORT`. Heroku's Node buildpack runs `npm start` the same way.
