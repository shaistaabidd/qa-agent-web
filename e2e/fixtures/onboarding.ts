type StepName = 'step1' | 'step2';

const STEP_FIELDS: Record<StepName, string[]> = {
  step1: ['firstName', 'lastName'],
  step2: ['phone'],
};

/**
 * An `onboarding` object as saas-api returns it. Pass the fields still missing per step; with no
 * argument every step is done. currentStep is the first incomplete step, in order, like the API.
 */
export function onboarding(missing: Partial<Record<StepName, string[]>> = {}) {
  const steps = (Object.keys(STEP_FIELDS) as StepName[]).map((step, index) => ({
    __typename: 'OnboardingStep',
    completed: (missing[step] ?? []).length === 0,
    missingFields: missing[step] ?? [],
    position: index + 1,
    step,
  }));
  const current = steps.find((step) => !step.completed);

  return {
    __typename: 'Onboarding',
    completed: !current,
    currentStep: current?.step ?? null,
    required: true,
    steps,
  };
}

export { STEP_FIELDS };
