---
paths:
  - "app/graphql/**/*.ts"
---

# GraphQL operation names

The operation name is what the Network tab, server logs, and e2e mocks show. It must say what the call does and be unique across the app.

- Name every query and mutation. Never leave it anonymous.
- Use `<Verb><Noun>` in PascalCase, matching the exported constant: `FETCH_USER` is `FetchUser`, `LOGIN_USER` is `LoginUser`.
- Two operations may hit the same field but never share a name. When a second shape is needed, name it for what it selects: `FetchUser` and `FetchUserSummary`.
- Renaming an operation means renaming its key in `mockGraphql` handlers and `callsTo(...)` in `e2e/`.

```ts
// ✅ GOOD
export const FETCH_USER = gql`
  query FetchUser($fetchUserId: ID) { ... }
`;

// ❌ NEVER
export const FETCH_USER = gql`
  query User($fetchUserId: ID) { ... }
`;
```
