# Do Not Open Localhost in a Preview Browser

Never open, navigate, or embed `localhost` (or `127.0.0.1`) in any in-editor or automated browser (IDE preview panel, Simple Browser, browser MCP tools, Playwright, `/run` screenshots).

## Do Not

```text
# ❌ NEVER
Open http://localhost:5173 in an IDE preview / browser tool
Navigate a browser MCP tool to http://localhost:* or http://127.0.0.1:*
Open a new browser tab just to "check the app"
```

- Do not use browser automation tools against local URLs
- Do not open a preview "just to verify" UI, routing, or API changes

## What To Do Instead

- Leave the user's own browser alone; assume they already have the app open
- If verification is needed, ask the user first whether to test it on localhost. Only test after they confirm
- If you must describe a URL, write it in chat — do not launch a preview

## Allowed Exceptions

Open or test localhost only after the user confirms, either because they asked (e.g. "open localhost in the browser", "screenshot the running app") or because you asked first and they said yes. Never start or restart the dev server for this (see the no-dev-server rule).
