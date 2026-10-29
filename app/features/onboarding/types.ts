import { Role } from '@/shared/lib/constants';

export type OnboardingRole = Role.PATIENT | Role.PHARMACY | Role.PROVIDER;

export enum OnboardingStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  DRAFT = 'draft',
  PENDING = 'pending',
}

export type ProviderOnboardingDraft = {
  addressLine1: string;
  addressLine2: string;
  allergies: string;
  city: string;
  contactPersonName: string;
  currentMedication: string;
  dateOfBirth: string;
  declineReason: string;
  email: string;
  fax: string;
  firstName: string;
  gender: string;
  height: string;
  lastName: string;
  licensedStates: string[];
  medicalHistory: string;
  npi: string;
  pharmacyName: string;
  phone: string;
  photoUrl: string;
  placeId: string;
  residenceState: string;
  role: OnboardingRole;
  specialty: string;
  state: string;
  status: OnboardingStatus;
  stripeConnected: boolean;
  submittedAt: string;
  weight: string;
  zip: string;
};
