# Do Not Assume — Always Clarify

Never assume intent, scope, or implementation details for any task.

## What NOT to Assume

- Which component or file to edit when multiple options exist
- The desired UI layout or visual behavior
- API payload shape or endpoint behavior
- Whether to refactor existing code vs. create new code
- Business logic or edge case handling

## What to Do Instead

- If a task is ambiguous, ask a clarifying question before writing any code
- If two approaches are valid, present both and ask which to use
- If requirements are incomplete, list what's missing and ask
- Never make decisions that affect business logic without confirmation

## Example

❌ Bad: User says "add a button" → agent picks a location and style without asking  
✅ Good: User says "add a button" → agent asks "Where should the button appear, and what should it do when clicked?"
