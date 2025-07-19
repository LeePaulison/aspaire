import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_AUTH } from '@/graphql/queries/user';
import { useUserStore } from '@/store/userStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useSession } from 'next-auth/react';
/**
 * Custom hook to fetch and store user data based on authentication session.
 * It uses Apollo Client to fetch user data and Zustand for state management.
 */
export function useFetchAndStoreUser() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const setPreferences = usePreferencesStore((s) => s.setPreferences);

  const [fetchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_AUTH);
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (user || !sessionData?.user) return;

    console.log('[useFetchAndStoreUser] Fetching user for:', sessionData.user.email);

    fetchUser({
      variables: {
        authProvider: 'GITHUB',
        authProviderId: sessionData.user.id,
        email: sessionData.user.email || '',
        name: sessionData.user.name || '',
      },
    });
  }, [user, sessionData, fetchUser]);

  useEffect(() => {
    if (data?.userByAuth) {
      console.log('[useFetchAndStoreUser] Storing fetched user:', data.userByAuth);

      const dbUser = data.userByAuth;
      const avatar = sessionData?.user?.image || '';

      // Compose enriched user object
      const enrichedUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar,
      };

      setUser(enrichedUser);

      if (dbUser.preferences) {
        setPreferences(dbUser.preferences);
      }
    }
  }, [data, setUser, setPreferences, sessionData]);

  return {
    loading,
    error,
    user,
  };
}
