import { useEffect, useState } from 'react';

import { useFeatureFlags } from '@/features/feature-flags';
import { Alert, AlertClose, AlertTitle } from '@/shared/ui/alert';

import { useLoginMutation } from './hooks/useLoginMutation';
import { LoginForm } from './LoginForm';
import { clearAuthError, peekAuthError } from './model/authStore';
import { clearRedirectTo } from './utils/flowStorage';

export function LoginPage() {
  const { isPending, submit } = useLoginMutation();
  const { isEnabled } = useFeatureFlags();
  const [authError, setAuthError] = useState<string | null>(peekAuthError);

  useEffect(() => {
    clearRedirectTo();
    clearAuthError();
  }, []);

  return (
    <div className="flex w-full flex-col gap-[16px]">
      {authError ? (
        <Alert variant="error">
          <AlertTitle>{authError}</AlertTitle>
          <AlertClose onClick={() => setAuthError(null)} />
        </Alert>
      ) : null}
      <LoginForm
        isPending={isPending}
        onSubmit={submit}
        showGoogle={isEnabled('googleSignInEnabled')}
        showSignup={isEnabled('signUpEnabled')}
      />
    </div>
  );
}
