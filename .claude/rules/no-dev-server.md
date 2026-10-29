# Do Not Start or Restart the Dev Server

Never start, restart, kill, or relaunch the local development server on your own.

## Do Not Run

```bash
# ❌ NEVER unless the user explicitly asks
yarn dev
yarn dev --port <port>
npm run dev
kill <pid>   # when used to restart the dev server
pkill -f "react-router dev"
pkill -f vite
```

## What To Do Instead

- Assume the user already has a server running, or will start one
- Use an existing terminal / URL the user or session already has
- If the page cannot be reached or HMR looks stale, **tell the user** and ask them to start or restart the server
- Do not open a new port “just to verify” UI changes

## Allowed Exceptions

Only start or restart the server when the user clearly requests it, e.g. "start the dev server", "restart npm run dev", or "run the app on 5173".
