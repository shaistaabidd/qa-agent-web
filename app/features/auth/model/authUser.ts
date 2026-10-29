import { Role, UserStatus } from '@/shared/lib/constants';

export type AuthMeAddress = {
  adminArea: string;
  country: string;
  line1: string;
  line2?: string | null;
  locality: string;
  placeId?: string | null;
  postalCode: string;
};

export type AuthMeConnect = {
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  status: 'complete' | 'not_started' | 'pending' | 'restricted';
};

export type AuthMeProvider = {
  address: AuthMeAddress;
  connect?: AuthMeConnect | null;
  licensedStates: string[];
  npi?: string | null;
  phone: string;
  photoUrl?: string | null;
  rejectionReason?: string | null;
  specialty: string;
};

export type AuthMePharmacy = {
  address: AuthMeAddress;
  connect?: AuthMeConnect | null;
  contactName: string;
  createdAt?: string | null;
  fax: string;
  licensedStates: string[];
  logoUrl?: string | null;
  name: string;
  npi?: string | null;
  phone: string;
  rejectionReason?: string | null;
};

export type AuthMe = {
  email: string;
  emailVerifiedAt?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  id: string;
  lastName?: string | null;
  passwordChangedAt?: string | null;
  pharmacy?: AuthMePharmacy | null;
  photoUrl?: string | null;
  provider?: AuthMeProvider | null;
  rejectionReason?: string | null;
  role: Role;
  status: UserStatus;
  submittedAt?: string | null;
  twoFactorEnabled?: boolean;
};

function unavailable(): never {
  throw new Error('This action is not available without a backend.');
}

export function getMe(): Promise<AuthMe> {
  return unavailable();
}

export function completeProviderSignup(_formData: FormData): Promise<AcceptedResponse> {
  return unavailable();
}

export function completePharmacySignup(_formData: FormData): Promise<AcceptedResponse> {
  return unavailable();
}

export type AcceptedResponse = {
  message: string;
  otp?: string;
  resetUrl?: string;
};

export type UpdateProfilePayload = {
  address?: {
    adminArea: string;
    country?: string;
    line1: string;
    line2?: string;
    locality: string;
    placeId?: string;
    postalCode: string;
  };
  contactName?: string;
  fax?: string;
  firstName?: string;
  lastName?: string;
  licensedStates?: string[];
  name?: string;
  npi?: string | null;
  phone?: string;
};

export type ConnectAccountLink = {
  expiresAt: string;
  url: string;
};

export function updateMe(_payload: UpdateProfilePayload): Promise<AuthMe> {
  return unavailable();
}

export function updateMePhoto(_photo: File): Promise<AuthMe> {
  return unavailable();
}

export function deleteMePhoto(): Promise<AuthMe> {
  return unavailable();
}

export function changePassword(_payload: {
  currentPassword: string;
  password: string;
}): Promise<AcceptedResponse> {
  return unavailable();
}

export function changeEmail(_payload: {
  email: string;
  password: string;
}): Promise<AcceptedResponse> {
  return unavailable();
}

export function resendEmailChange(): Promise<AcceptedResponse> {
  return unavailable();
}

export function verifyEmailChange(_payload: { otp: string }): Promise<AuthMe> {
  return unavailable();
}

export function enableTwoFactor(): Promise<AcceptedResponse> {
  return unavailable();
}

export function resendTwoFactor(): Promise<AcceptedResponse> {
  return unavailable();
}

export function verifyTwoFactor(_payload: { otp: string }): Promise<AuthMe> {
  return unavailable();
}

export function disableTwoFactor(): Promise<AcceptedResponse> {
  return unavailable();
}

export function resendDisableTwoFactor(): Promise<AcceptedResponse> {
  return unavailable();
}

export function verifyDisableTwoFactor(_payload: { otp: string }): Promise<AuthMe> {
  return unavailable();
}

export function createConnectAccountLink(): Promise<ConnectAccountLink> {
  return unavailable();
}
