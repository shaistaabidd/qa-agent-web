import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { Link } from 'react-router';

import { PROJECTS_PATH } from '@/features/projects';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderText,
  CardTitle,
} from '@/shared/ui/card';

import { useGithubCallback } from './hooks/useGithubCallback';

export function GithubCallbackPage() {
  const callback = useGithubCallback();
  const waiting = !callback.choice && !callback.message && !callback.error;

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-[16px] md:p-[24px]">
      <Card className="w-full max-w-[520px]">
        <CardHeader>
          <CardHeaderText>
            <CardTitle>
              {callback.choice ? 'Choose the GitHub account to use' : 'Connecting GitHub'}
            </CardTitle>
            {callback.choice ? (
              <CardDescription>
                The QA Agent app is installed on more than one account you can access.
              </CardDescription>
            ) : null}
          </CardHeaderText>
        </CardHeader>
        <CardContent className="flex flex-col gap-[16px]">
          {waiting ? (
            <CircleNotchIcon
              aria-label="Connecting to GitHub"
              className="size-[24px] animate-spin text-icon-medium"
              weight="regular"
            />
          ) : null}
          {callback.message ? <p className="text-fg-secondary">{callback.message}</p> : null}
          {callback.error ? (
            <Alert variant="error">
              <AlertDescription>{callback.error}</AlertDescription>
            </Alert>
          ) : null}
          {callback.choice ? (
            <>
              {callback.selectError ? (
                <Alert variant="error">
                  <AlertDescription>{callback.selectError}</AlertDescription>
                </Alert>
              ) : null}
              <div className="flex flex-col items-start gap-[8px]">
                {callback.choice.installations.map((installation) => (
                  <Button
                    disabled={callback.selecting}
                    key={installation.id}
                    onClick={() =>
                      void callback.select(callback.choice!.choiceToken, installation.id)
                    }
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    {installation.accountLogin} (
                    {installation.accountType === 'Organization' ? 'organization' : 'personal'})
                  </Button>
                ))}
              </div>
            </>
          ) : null}
          {!waiting ? (
            <div>
              <Button asChild size="md" variant="ghost">
                <Link to={PROJECTS_PATH}>Back to projects</Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
