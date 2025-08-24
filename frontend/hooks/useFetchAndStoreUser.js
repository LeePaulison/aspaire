import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_AUTH } from '@/graphql/queries/user';
import { CREATE_USER } from '@/graphql/mutations/user';
import { useMutation } from '@apollo/client';
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
  const setResumes = useResumesStore((s) => s.setResumes);

  const [fetchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_AUTH);
  const { data: sessionData } = useSession();

  // At the top of your hook, after importing CREATE_USER:
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    if (user || !sessionData?.user) return;

    console.log('[useFetchAndStoreUser] Fetching user for:', sessionData.user.email);
    console.log('[DEBUG] Full sessionData:', JSON.stringify(sessionData, null, 2));

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
      // ✅ User exists, same logic as before
      const dbUser = data.userByAuth;
      const avatar = sessionData?.user?.image || '';

      const enrichedUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar,
      };

      setUser(enrichedUser);
      if (dbUser.preferences) setPreferences(dbUser.preferences);
      if (dbUser.resumes) setResumes(dbUser.resumes);
    } else if (sessionData?.user) {
      console.warn('[useFetchAndStoreUser] No user found — creating new user');

      createUser({
        variables: {
          input: {
            authProvider: 'GITHUB',
            authProviderId: sessionData.user.id,
            email: sessionData.user.email || '',
            name: sessionData.user.name || '',
          },
        },
      })
        .then(({ data }) => {
          const newUser = data?.createUserWithAuth;
          if (!newUser) return;

          const avatar = sessionData?.user?.image || '';
          const enrichedUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar,
          };

          setUser(enrichedUser);
          if (newUser.preferences) setPreferences(newUser.preferences);
          if (newUser.resumes) setResumes(newUser.resumes);
        })
        .catch((err) => {
          console.error('[useFetchAndStoreUser] Failed to create user:', err);
        });
    }
  }, [data, setUser, setPreferences, setResumes, sessionData]);

  return {
    loading,
    error,
    user,
  };
}
