# Branded Scrollbar

Use `scrollbarClass` from `@/shared/lib/scrollbar` on every overflow-y/x surface (sidebar, dropdown, textarea, dialog, lists). Do not invent new thumb, track, or width values.

Thumb is `--border-color-medium`. Track is transparent. Size is 4px, rounded-full, `scrollbar-width: thin`.

```ts
import { scrollbarClass } from '@/shared/lib/scrollbar';

export const listClass = ['overflow-y-auto', scrollbarClass].join(' ');
```

```ts
// ❌ NEVER
'[scrollbar-color:var(--color-slate-500)_var(--color-slate-800)]'
'[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-slate-800'
```
