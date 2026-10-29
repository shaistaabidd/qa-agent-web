import { useSyncExternalStore } from 'react';
import { create } from 'zustand';

import { onSessionCleared } from '@/features/auth';
import { Role } from '@/shared/lib/constants';

import { ONBOARDING_STORAGE_KEY } from './constants';
import { OnboardingStatus, type ProviderOnboardingDraft } from './types';

export const DEFAULT_ONBOARDING_DRAFT: ProviderOnboardingDraft = {
  addressLine1: '',
  addressLine2: '',
  allergies: '',
  city: '',
  contactPersonName: '',
  currentMedication: '',
  dateOfBirth: '',
  declineReason: 'Insufficient details provided.',
  email: '',
  fax: '',
  firstName: '',
  gender: '',
  height: '',
  lastName: '',
  licensedStates: [],
  medicalHistory: '',
  npi: '',
  pharmacyName: '',
  phone: '',
  photoUrl: '',
  placeId: '',
  residenceState: '',
  role: Role.PROVIDER,
  specialty: '',
  state: '',
  status: OnboardingStatus.DRAFT,
  stripeConnected: false,
  submittedAt: '',
  weight: '',
  zip: '',
};

const ONBOARDING_DRAFT_VERSION = 1;

type OnboardingState = {
  draft: ProviderOnboardingDraft;
};

const useOnboardingStore = create<OnboardingState>(() => ({
  draft: DEFAULT_ONBOARDING_DRAFT,
}));

function readStoredDraft(): ProviderOnboardingDraft {
  if (typeof sessionStorage === 'undefined') {
    return DEFAULT_ONBOARDING_DRAFT;
  }

  try {
    const stored = sessionStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_ONBOARDING_DRAFT;
    }

    const parsed = JSON.parse(stored) as {
      version?: number;
      draft?: Partial<ProviderOnboardingDraft>;
    };
    if (parsed?.version !== ONBOARDING_DRAFT_VERSION || !parsed.draft) {
      sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return DEFAULT_ONBOARDING_DRAFT;
    }

    return { ...DEFAULT_ONBOARDING_DRAFT, ...parsed.draft };
  } catch {
    return DEFAULT_ONBOARDING_DRAFT;
  }
}

function writeStoredDraft(draft: ProviderOnboardingDraft) {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ version: ONBOARDING_DRAFT_VERSION, draft }),
    );
  } catch {
    // Storage can be blocked or full. The draft stays in memory.
  }
}

if (typeof sessionStorage !== 'undefined') {
  useOnboardingStore.setState({ draft: readStoredDraft() });
}

export function getOnboardingDraft() {
  return useOnboardingStore.getState().draft;
}

export function updateOnboardingDraft(patch: Partial<ProviderOnboardingDraft>) {
  const draft = { ...getOnboardingDraft(), ...patch };
  writeStoredDraft(draft);
  useOnboardingStore.setState({ draft });
}

export function clearOnboardingDraft() {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // Storage can be blocked.
    }
  }

  useOnboardingStore.setState({ draft: DEFAULT_ONBOARDING_DRAFT });
}

export function useOnboardingDraft() {
  return useSyncExternalStore(
    useOnboardingStore.subscribe,
    getOnboardingDraft,
    () => DEFAULT_ONBOARDING_DRAFT,
  );
}

if (typeof window !== 'undefined') {
  onSessionCleared(clearOnboardingDraft);
}
