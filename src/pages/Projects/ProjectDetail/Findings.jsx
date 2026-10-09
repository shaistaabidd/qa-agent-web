import { FindingsTable } from './FindingsTable'

// Sentry-style issues: the same problem across runs is one row, with how
// many runs it appeared in and whether it's new, ongoing, regressed or resolved.
export const Findings = ({ project }) => <FindingsTable projectId={project.id} />
