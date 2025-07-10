'use client';

import { Button } from '@/components/ui/button';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_BY_AUTH } from '@/graphql/queries/user';
import React from 'react';

export default function HomePage() {
  const { data: useData } = useSession();
  const [fetchUser, { loading, error, data }] = useLazyQuery(GET_USER_BY_AUTH);

  React.useEffect(() => {
    console.log('[HomePage] useSession data:', useData);
    console.log('[HomePage] user:', useData?.user);

    if (useData?.user) {
      console.log('[HomePage] Fetching user data for:', useData.user.email);
      fetchUser({
        variables: {
          authProvider: 'GITHUB',
          authProviderId: useData.user.id,
          email: useData.user.email || '',
          name: useData.user.name || '',
        },
      });
    }
  }, [useData, fetchUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user data: {error.message}</p>;

  console.log('[HomePage] Fetched user data:', data);

  return (
    <>
      <div className='flex flex-col justify-center w-full h-full text-center space-y-6'>
        <h1 className='text-4xl font-bold tracking-tight' style={{ color: 'var(--primary)' }}>
          Welcome to AspAIre
        </h1>

        <p className='text-lg text-[var(--muted-foreground)]'>
          Your intelligent, AI-powered job search assistant. Go beyond searching—AspAIre matches jobs to your skills,
          career goals, and preferred locations.
        </p>

        <div className='flex justify-center gap-4 mt-8'>
          <Button
            className='bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[oklch(0.28_0.04_260)]'
            onClick={() => alert('Explore coming soon!')}
          >
            Explore Features
          </Button>

          <Button
            variant='outline'
            className='border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
            onClick={() => alert('Sign up coming soon!')}
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </>
  );
}
