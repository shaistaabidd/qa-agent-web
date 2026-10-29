# App Folder Structure

Put code in the folder that owns it. Do not recreate top-level `app/components`, `app/pages`, `app/layouts`, `app/hooks`, `app/stores`, or `app/lib`.

```
app/
  routes.ts               composes route groups
  routing/                one group file per area
  routes/                 URL entry only
  features/<feature>/     one product area
    components/
    hooks/
    model/
    index.ts
  shell/                  sidebar and auth frame
  shared/
    ui/                   design system
    lib/                  helpers used by two or more features
    styles/
  providers/              app bootstrap
```

## Rules

- A route file sets the path, title, and which feature page to render. Do not put forms or layout there.
- Feature-only UI, hooks, and types stay in that feature. Page, `types.ts`, `constants.ts`, and `utils.ts` sit at the feature root. Everything else goes in `components/`, `hooks/`, or `model/`.
- Another feature may import `@/features/<name>` (`index.ts`) only. Do not import `@/features/<name>/components/...` or `@/features/<name>/hooks/...`.
- `shared/ui` is the design system. It does not import `features` or `shell`.
- `shared/lib` is only for code used by two or more features (`schemas`, `FormInput`, `scrollbar`).
- Session and auth types live in `features/auth`. Do not add a global store or hook folder.

```tsx
// ❌ BAD
import { AccountTab } from '@/features/settings/components/AccountTab';

// ✅ GOOD
import { SettingsPage } from '@/features/settings';
```
