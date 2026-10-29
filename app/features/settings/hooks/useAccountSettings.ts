import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

import { type AuthGraphQLUser, getPersistedUserId, useAuthStore } from '@/features/auth';
import { FETCH_USER } from '@/graphql/queries/userQueries';

import { mapUserToProfile } from '../mapUserToProfile';
import { useChangePassword } from './useChangePassword';
import { useEmailChange } from './useEmailChange';
import { useProfileMutations } from './useProfileMutations';

type FetchUserData = { fetchUser?: AuthGraphQLUser };

export function useAccountSettings() {
  const userId = useAuthStore((state) => state.user?.id) ?? getPersistedUserId();
  const { data, error, loading, refetch } = useQuery<FetchUserData>(FETCH_USER, {
    skip: !userId,
    variables: { fetchUserId: userId },
  });
  const user = data?.fetchUser;
  const profile = useMemo(() => (user ? mapUserToProfile(user) : undefined), [user]);

  return {
    ...useProfileMutations(),
    ...useChangePassword(),
    ...useEmailChange(),
    isError: !loading && !profile && (Boolean(error) || data !== undefined),
    isLoading: loading && !profile,
    profile,
    refetch,
  };
}
