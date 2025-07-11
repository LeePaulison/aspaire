import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_AUTH } from '@/graphql/queries/user';
import { useUserStore } from '@/store/userStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useSession } from 'next-auth/react';

export function useFetchAndStoreUser() {
  const setUser = useUserStore((s) => s.setUser);
  const setPreferences = usePreferencesStore((s) => s.setPreferences);

  const [fetchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_AUTH);

  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData?.user) {
      console.log('[useFetchAndStoreUser] Session found:', sessionData.user.email);

      fetchUser({
        variables: {
          authProvider: 'GITHUB',
          authProviderId: sessionData.user.id,
          email: sessionData.user.email || '',
          name: sessionData.user.name || '',
        },
      });
    }
  }, [sessionData, fetchUser]);

  useEffect(() => {
    if (data?.userByAuth) {
      console.log('[useFetchAndStoreUser] Storing fetched user:', data.userByAuth);

      setUser(data.userByAuth);

      if (data.userByAuth.preferences) {
        console.log('[useFetchAndStoreUser] Storing user preferences:', data.userByAuth.preferences);
        setPreferences(data.userByAuth.preferences);
      }
    }
  }, [data, setUser, setPreferences]);

  return {
    loading,
    error,
    user: data?.userByAuth,
  };
}
