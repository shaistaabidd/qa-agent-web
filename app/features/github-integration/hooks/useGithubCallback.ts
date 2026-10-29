import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { type Project, projectPath } from '@/features/projects';
import {
  AUTHORIZE_GITHUB_USER,
  COMPLETE_GITHUB_INSTALLATION,
  SELECT_GITHUB_INSTALLATION,
} from '@/graphql/mutations/integrationMutations';
import { getMessageString } from '@/shared/lib/getMessageString';
import { useMutate } from '@/shared/lib/useMutate';
import { toast } from '@/shared/ui/toast';

import { GITHUB_INSTALL_STATE_KEY } from '../constants';
import type { GithubInstallation } from '../types';

type Choice = { choiceToken: string; installations: GithubInstallation[] };

type Outcome =
  | { kind: 'choice'; choice: Choice }
  | { kind: 'error'; message: string }
  | { kind: 'message'; message: string };

const REQUESTED_MESSAGE =
  'Installation requested. Once an owner of the GitHub organization approves it, open your project and choose "Already installed? Sign in with GitHub".';
const MISSING_MESSAGE =
  'GitHub did not return the details needed to finish connecting. Please try again from your project.';
const NONE_MESSAGE =
  'The QA Agent GitHub App isn\'t installed anywhere you have access to. Ask an organization owner to install it, or use "Connect GitHub" to install it on your own account.';

/** Everything the URL (and the copy saved before leaving) says. Read only, so it is safe to run twice. */
function readRequest(params: URLSearchParams) {
  return {
    code: params.get('code'),
    installationId: params.get('installation_id'),
    requested: params.get('setup_action') === 'request',
    state: params.get('state') || sessionStorage.getItem(GITHUB_INSTALL_STATE_KEY),
  };
}

/**
 * Finishes the round trip to GitHub, which lands here after the install screen (with an
 * installation id) or after a plain "Sign in with GitHub" (without one).
 */
export function useGithubCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mutate = useMutate();
  const [request] = useState(() => readRequest(params));
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);
  // The one-time code can't be sent twice, so React's double effect in development must not resend it.
  const started = useRef(false);

  const blocked = request.requested
    ? REQUESTED_MESSAGE
    : !request.code || !request.state
      ? MISSING_MESSAGE
      : null;

  function finish(project: Project) {
    toast.success('GitHub connected. Now pick a repository.');
    navigate(projectPath(project.id), { replace: true });
  }

  async function select(choiceToken: string, installationId: string) {
    setSelecting(true);
    setSelectError(null);
    try {
      const data = await mutate<{ selectGithubInstallation: { project: Project } }>(
        SELECT_GITHUB_INSTALLATION,
        { input: { choiceToken, installationId } },
      );
      finish(data.selectGithubInstallation.project);
    } catch (error) {
      setSelectError(getMessageString(error, 'Could not link that installation.'));
      setSelecting(false);
    }
  }

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    sessionStorage.removeItem(GITHUB_INSTALL_STATE_KEY);
    // Drop the one-time code from the address so a reload can't resend it.
    window.history.replaceState(null, '', window.location.pathname);

    const { code, installationId, state } = request;
    if (blocked || !code || !state) {
      return;
    }

    async function complete() {
      try {
        if (installationId) {
          const data = await mutate<{ completeGithubInstallation: { project: Project } }>(
            COMPLETE_GITHUB_INSTALLATION,
            { input: { code, installationId, state } },
          );
          finish(data.completeGithubInstallation.project);
          return;
        }

        const data = await mutate<{ authorizeGithubUser: Choice }>(AUTHORIZE_GITHUB_USER, {
          input: { code, state },
        });
        const { choiceToken, installations } = data.authorizeGithubUser;
        if (installations.length === 1) {
          await select(choiceToken, installations[0].id);
        } else if (installations.length === 0) {
          setOutcome({ kind: 'message', message: NONE_MESSAGE });
        } else {
          setOutcome({ choice: { choiceToken, installations }, kind: 'choice' });
        }
      } catch (error) {
        setOutcome({
          kind: 'error',
          message: getMessageString(error, 'Could not finish connecting GitHub.'),
        });
      }
    }

    void complete();
    // Runs once on arrival; the request is fixed for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    choice: outcome?.kind === 'choice' ? outcome.choice : null,
    error: outcome?.kind === 'error' ? outcome.message : null,
    message: blocked ?? (outcome?.kind === 'message' ? outcome.message : null),
    select,
    selectError,
    selecting,
  };
}
