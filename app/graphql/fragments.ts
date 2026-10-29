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

export const clinicSubscriptionFields = `
  cancelAtPeriodEnd
  canceledAt
  clinicId
  createdAt
  currentPeriodEnd
  currentPeriodStart
  id
  status
  stripeSubscriptionId
  updatedAt
`;

export const clinicFields = `
  access
  activeClients
  activePractitioners
  activeTeamMembers
  additionalSequencePrice
  additionalSequencePriceForFunctionRx
  additionalSequencePriceForPractitioners
  address
  archived
  assessmentPrice
  basePrice
  city
  createdAt
  email
  facebookLink
  id
  imageUrl
  inactiveClients
  inactivePractitioners
  inactiveTeamMembers
  instagramLink
  linkedinLink
  maxSequenceLimit
  name
  phone
  revaluationPrice
  scheduledArchiveAt
  serviceType
  state
  submittedAssessmentPrice
  virtualTherapyAppointmentPricing
  subscription {
    ${clinicSubscriptionFields}
  }
  theme
  tiktokLink
  totalClients
  totalPractitioners
  totalStaff
  totalTeamMembers
  twitterLink
  updatedAt
  zip
`;

export const clinicDetailFields = `
  ${clinicFields}
  website
`;

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

export const resourceFields = `
  category
  createdAt
  description
  id
  isActive
  pdfFileUrl
  resourceType
  title
  videoLink
`;
