---
paths:
  - "**/*.{ts,tsx}"
---

# Phosphor Icons

The project icon library is **`@phosphor-icons/react`**. Import each glyph from its own path, with the `Icon` suffix. The package root re-exports every icon, so a barrel import pulls the whole set into the page.

```tsx
// ✅ CORRECT
import { CheckIcon } from '@phosphor-icons/react/Check';
import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';

<CheckIcon aria-hidden weight="regular" />
<MagnifyingGlassIcon aria-hidden className="size-[16px]" weight="bold" />

// ❌ NEVER — barrel import loads every icon
import { CheckIcon, ArrowLeftIcon, TrashIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

// ❌ NEVER — missing Icon suffix
import { Check } from '@phosphor-icons/react/Check';

<Check aria-hidden weight="regular" />
```

The path is the icon name without `Icon`. Phosphor exports both names from that file. The binding in source must be the `Icon` name: `CheckIcon`, `DotsThreeIcon`, `PencilSimpleIcon`, `MagnifyingGlassIcon`, and the same pattern for every glyph. Do not alias that name away (`CopyIcon as CopyGlyph`). The `Icon` type comes from `@phosphor-icons/react/lib`.

## When Adding or Implementing Icons

1. **Search Phosphor first** — find a matching icon in `@phosphor-icons/react` (name, concept, or close equivalent).
2. **Import from Phosphor** — one file per icon, `@phosphor-icons/react/<Name>`, with the `Icon` suffix. Follow existing usage (`weight`, `size`/`className`, `aria-hidden` when decorative).
3. **Only then use Figma MCP** — if no suitable Phosphor icon exists, import/export the asset from Figma via MCP.

## Rules

- Never default to Figma MCP icon export when implementing designs that include icons
- Prefer a close Phosphor equivalent over a one-off Figma SVG for standard UI glyphs (arrows, checks, search, info, close, etc.)
- Ask before adding a custom SVG or new icon asset if Phosphor coverage is unclear
- Do not introduce another icon package (e.g. Lucide, Heroicons) alongside Phosphor
