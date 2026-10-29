# Reuse Existing Code

Before writing a component, hook, helper, type, query or GraphQL selection, search for one that already does the job (`grep -rn` the name and a distinctive line of the logic) and use it. Never copy a function into a second feature.

- Code used by two or more features lives in `app/shared/lib/` (or `app/shared/ui/` for design-system UI). When a second feature needs a feature's helper, move it there and point both at it.
- Shared pieces to reach for first: `@/shared/lib/dates` (`toIsoDate`, `parseIsoDate`, `formatDateTime`), `@/shared/lib/use-date-range-filters`, `FormInput` / `FormPhoneField`, `@/shared/lib/schemas`, the CRUD screen in `@/shared/ui/crud`.
- GraphQL fields come from `app/graphql/fragments.ts` (see `graphql-fragments.md`); add to an existing selection instead of listing the same fields again.
- Refactoring to reuse must not change behavior: `npm run typecheck`, `npm run lint` and the Playwright suite stay green.

```ts
// ✅ GOOD
import { formatDateTime } from '@/shared/lib/dates';

// ❌ NEVER — a second copy of a helper another feature already has
export function formatSmsLogDate(value: string | null | undefined) { /* same body */ }
```
