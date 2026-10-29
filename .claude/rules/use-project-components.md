# Use Project Components

Check `app/shared/ui/` before building any UI element. Prefer its components over raw HTML elements or new one-off components. The folder is the source of truth for what exists.

## Rules

- Before building a button, input, dialog, table, tab, dropdown, toast, or similar, look for it in `app/shared/ui/` and import it from its folder (`@/shared/ui/button`), not from the `@/shared/ui` barrel.
- Never use raw `<button>`, `<input>`, `<select>`, `<textarea>`, or `<label>` when a wrapper exists.
- If a required component does not exist, ask the user before creating a new one.
- Form fields follow the TanStack Form rule (`FormInput`, `FormTextarea`, `FormDropdown` in `@/shared/lib`).
