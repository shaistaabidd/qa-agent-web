import { useQuery } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';

import { type AuthUser, useAuthStore } from '@/features/auth/model/authStore';
import { type AuthGraphQLUser, displayNameFromUser } from '@/features/auth/model/types';
import { getPersistedUserId } from '@/features/auth/utils/flowStorage';
import { applyGraphQLSession, mapGraphQLUser } from '@/features/auth/utils/session';
import { FETCH_USER } from '@/graphql/queries/userQueries';

type FetchUserData = {
  fetchUser?: AuthGraphQLUser;
};

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

function profileChanged(current: AuthUser, next: AuthUser) {
  if (!current || !next) {
    return true;
  }

  const currentFields = current as Record<string, unknown>;
  return Object.entries(next).some(([key, value]) => currentFields[key] !== value);
}

export function useAuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const signInRedirecting = useAuthStore((state) => state.signInRedirecting);
  const [persistedUserId] = useState(getPersistedUserId);
  const userId = useAuthStore((state) => state.user?.id) ?? persistedUserId;

  const { data, error, refetch } = useQuery(FETCH_USER, {
    skip: !accessToken || !userId || signInRedirecting,
    context: { silentErrors: true },
    variables: { fetchUserId: userId },
  });

  // The refresh fails silently, and the session flags arrive with it, so try again a couple of times.
  const retries = useRef(0);
  useEffect(() => {
    if (!error || retries.current >= MAX_RETRIES) {
      return;
    }

    const timer = setTimeout(
      () => {
        retries.current += 1;
        void refetch().catch(() => {});
      },
      RETRY_DELAY_MS * (retries.current + 1),
    );

    return () => clearTimeout(timer);
  }, [error, refetch]);

  useEffect(() => {
    const nextUser = (data as FetchUserData | null | undefined)?.fetchUser;
    const token = useAuthStore.getState().accessToken;
    const currentUser = useAuthStore.getState().user;

    if (!nextUser || !token) {
      return;
    }

    const mapped = mapGraphQLUser(nextUser);
    if (!profileChanged(currentUser, { ...mapped, name: displayNameFromUser(mapped) })) {
      return;
    }

    applyGraphQLSession(token, nextUser);
  }, [data]);
}
