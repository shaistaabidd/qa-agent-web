import { UserCirclePlusIcon } from '@phosphor-icons/react/UserCirclePlus';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';
import { Link } from 'react-router';

import { useFeatureFlags } from '@/features/feature-flags';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Spinner } from '@/shared/ui/spinner';

import { useSignupMutation } from './hooks/useSignupMutation';
import { LOGIN_PATH } from './paths';
import { SignupForm } from './SignupForm';

export function SignupPage() {
  const { isEnabled, loaded, loading, refresh } = useFeatureFlags();
  // A refused sign-up re-reads the flag, so a page left open shows "closed" once it was switched off.
  const { isPending, submit } = useSignupMutation({ onFailed: refresh });

  // Fail closed: the form only shows once the API has confirmed sign-up is on.
  if (!loaded && loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner aria-label="Checking sign-up availability" size="lg" tone="primary" />
      </div>
    );
  }

  if (!loaded) {
    return (
      <EmptyState
        icon={<WarningCircleIcon aria-hidden weight="regular" />}
        subheading="We could not check whether sign-up is available. Please try again."
        title="Sign-up is unavailable"
      >
        <Button onClick={refresh} variant="outline">
          Try again
        </Button>
      </EmptyState>
    );
  }

  // The API refuses sign-up while the flag is off; say so up front instead of after the form.
  if (!isEnabled('signUpEnabled')) {
    return (
      <EmptyState
        icon={<UserCirclePlusIcon aria-hidden weight="regular" />}
        subheading="New accounts are not being accepted right now. Please try again later."
        title="Sign-up is closed"
      >
        <Button asChild variant="outline">
          <Link to={LOGIN_PATH}>Back to log in</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <SignupForm
      isPending={isPending}
      onSubmit={submit}
      showGoogle={isEnabled('googleSignInEnabled')}
    />
  );
}
