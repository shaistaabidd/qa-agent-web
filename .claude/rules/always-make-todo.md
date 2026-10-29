# Always Create a Todo List

Before working on any task with 3 or more steps, create a todo list using Claude's task/todo tool (`TodoWrite`) to track progress.

## When to Create Todos

- Any feature implementation
- Bug fixes with multiple steps
- Refactoring tasks
- Any task that touches more than 2 files

## Format

Break the task into small, specific, actionable items. Mark each as `pending`, `in_progress`, or `completed` as you go. Only one item should be `in_progress` at a time.

## Example

```
1. Read existing component to understand current structure [in_progress]
2. Add new prop to component interface [pending]
3. Implement logic [pending]
4. Update styles [pending]
5. Check for linter errors [pending]
```
