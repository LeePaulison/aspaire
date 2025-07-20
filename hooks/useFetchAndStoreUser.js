import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_AUTH } from '@/graphql/queries/user';
import { useUserStore } from '@/store/userStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useResumesStore } from '@/store/resumesStore';
// Next Auth imports
import { useSession } from 'next-auth/react';
/**
 * Custom hook to fetch and store user data based on authentication session.
 * It uses Apollo Client to fetch user data and Zustand for state management.
 */
export function useFetchAndStoreUser() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const setPreferences = usePreferencesStore((s) => s.setPreferences);
  const setResumes = useResumesStore((s) => s.addResumes);

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

      // Log the Preferences fetched
      console.log(`[useFetchAndStoreUser] Stored preferences for user: ${dbUser.id}, Preferences:`, dbUser.preferences);
      if (dbUser.preferences) {
        setPreferences(dbUser.preferences);
      }

      // Log the number of resumes fetched
      console.log(`[useFetchAndStoreUser] Stored ${dbUser.resumes.length} resumes`);

      if (dbUser.resumes) {
        console.log('[useFetchAndStoreUser] Resumes:', dbUser.resumes);
        console.log('🚨 Raw dbUser.resumes:', dbUser.resumes);
        console.log('🔍 Is nested?', Array.isArray(dbUser.resumes[0]));

        setResumes(dbUser.resumes);
      }
    }
  }, [data, setUser, setPreferences, setResumes, sessionData]);

  return {
    loading,
    error,
    user,
  };
}
