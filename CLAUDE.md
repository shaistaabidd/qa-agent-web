@AGENTS.md

# Project rules

Detailed project rules live in `.claude/rules/*.md` and load automatically. Rules with a `paths:` header load only when matching files are in play; the rest load every session.

`.cursor/rules/*.mdc` is the Cursor copy of the same rules. When you change a rule, update both so they do not drift.
