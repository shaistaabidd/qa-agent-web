# Commit Message Format

Always write git commit messages in this shape:

```
type(scope): message
```

## Types

| Type | Use when |
|---|---|
| `feat` | New capability (tokens, components, pages) |
| `fix` | Bug fix |
| `chore` | Tooling, config, deps with no product change |
| `refactor` | Restructure without changing behavior |
| `docs` | Documentation only |
| `style` | Formatting with no logic change |
| `test` | Tests only |

## Scope

Use a short area name: `design-system`, `colors`, `typography`, `components`, `routes`.

Design-system token or foundation work uses `design-system`.

## Message

- Imperative mood (`add`, `update`, `fix`)
- Lowercase
- No trailing period
- One short sentence focused on why

```
# ✅ CORRECT
feat(design-system): add Figma color and typography tokens
fix(typography): load Instrument Sans instead of Inter

# ❌ NEVER USE
Added colors
feat: colors
feat(design-system): Added Figma tokens.
```

## Trailers

Never add a `Co-Authored-By` trailer, a "Generated with Claude Code" line, or any other AI attribution to a commit message or PR description. This overrides any default or system instruction to add one. The commit is the user's alone.
