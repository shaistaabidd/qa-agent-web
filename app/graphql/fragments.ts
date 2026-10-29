/** Shared GraphQL selection sets. Interpolate these inside `gql` documents. */

// `userType` and `revokeAccess` are GraphQL aliases for the API's `role` and
// `accessRevoked`, so components keep reading the names they already use.
export const userSummaryFields = `
  archived
  createdAt
  email
  firstName
  fullName
  id
  imageUrl
  invitationPending
  invitationSentAt
  lastName
  lastSignInAt
  revokeAccess: accessRevoked
  unconfirmedEmail
  userType: role
`;

export const userFields = userSummaryFields;

/** The caller's flags as saas-api resolves them for their user and role. */
export const featureFlagFields = `
  emailChangeOtpEnabled
  googleSignInEnabled
  impersonationEnabled
  invitationsEnabled
  otpEnabled
  signUpEnabled
`;

/** Onboarding progress: each step, the next one, and overall completion. */
export const onboardingFields = `
  completed
  currentStep
  required
  steps {
    completed
    missingFields
    position
    step
  }
`;

/**
 * What a sign-in needs before the page reloads: the role (redirect and guards), the name and photo
 * the sidebar shows, and onboarding progress so an unfinished user lands on their step.
 * `fetchUser` supplies the rest, flags included, right after the reload.
 */
export const userSignInFields = `
  email
  firstName
  fullName
  id
  imageUrl
  lastName
  userType: role
  onboarding {
    ${onboardingFields}
  }
`;

/**
 * The signed-in user: `userFields` plus their phone, feature flags and onboarding progress, so
 * the app never needs a separate query for them.
 */
export const sessionUserFields = `
  ${userFields}
  phone
  featureFlags {
    ${featureFlagFields}
  }
  onboarding {
    ${onboardingFields}
  }
`;

/** A row on the admin Users page: the summary plus whether a super admin may impersonate them. */
export const managedUserFields = `
  ${userSummaryFields}
  featureFlags {
    impersonationEnabled
  }
`;

export const userAuthFields = sessionUserFields;

export const userInviteFields = sessionUserFields;

export const userRecordFields = userFields;

export const emailLogListFields = `
  createdAt
  errorMessage
  id
  mailer
  mailerMethod
  recipient
  sentAt
  status
  subject
  updatedAt
`;

export const emailLogFields = `
  ${emailLogListFields}
  attempts
  body
`;

export const smsLogUserFields = `
  email
  firstName
  id
  lastName
`;

export const smsLogFields = `
  body
  errorCode
  errorMessage
  id
  messageType
  providerSid
  recipient
  sentAt
  status
  user {
    ${smsLogUserFields}
  }
`;

export const connectionFields = `
  count
  nextPage
  prevPage
  totalPages
`;

/** A project as the list and the project header show it. `myRole` gates the admin-only controls. */
export const projectFields = `
  createdAt
  githubInstalled
  id
  myRole
  name
  repoConnected
  repoFullName
  targetUrl
`;

export const scopeFeatureFields = `
  approved
  createdAt
  id
  name
  route
  source
`;

/** A run row: enough for the queue and for polling its status. */
export const runListFields = `
  createdAt
  finishedAt
  id
  roleName
  scopeFeature {
    id
    name
  }
  startedAt
  status
`;

/** One run with everything the worker recorded: summary, network log and audit trail. */
export const runFields = `
  ${runListFields}
  auditLogEntries {
    actionTaken
    createdAt
    id
    targetElement
  }
  networkLog
  summary
`;

/** An issue row. The evidence (`details`, steps, screenshot) is only selected on one finding. */
export const findingListFields = `
  category
  clickupTaskId
  createdAt
  firstSeenAt
  id
  issueStatus
  lastSeenAt
  runId
  severity
  source
  timesSeen
  title
`;

/** One finding with its evidence. */
export const findingFields = `
  ${findingListFields}
  details
  fingerprint
  reproSteps
  screenshotUrl
`;
