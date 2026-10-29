# Design Tokens

Use semantic tokens from `app/shared/styles/colors.css` and the `@theme` block in `app/shared/styles/app.css`. Do not use raw palette classes, hex values, or one-off shadows in `app/shared/ui` or feature code.

- Surfaces: `bg-surface-white`, `bg-surface-background`, `bg-surface-background-variant`. Not `bg-white`, `bg-slate-*`, `bg-amber-*`.
- Overlays: `bg-bg-scrim`. Not `bg-black/NN`.
- Errors: `text-error`, `text-fg-danger`, `bg-bg-danger-subtle`, `border-danger`. Not `text-red-*`.
- Borders: `border-low` and the `--border-color-*` variables.
- Shadows: `shadow-popover` for floating menus and tooltips, `shadow-modal` for dialogs and sheets. Not `shadow-[0px_4px_12px_...]`.

If no token fits, ask the user before adding one. Add it once in `colors.css` or `app.css`, then use it.

```tsx
// ✅ GOOD
<div className="bg-surface-white shadow-popover text-error" />

// ❌ NEVER
<div className="bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] text-red-600" />
```
