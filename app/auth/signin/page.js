'use client';
// Next Auth imports
import { signIn } from 'next-auth/react';
// Next Router imports
import { useSearchParams } from 'next/navigation';
// Shadcn UI imports
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-950'>
      <div className='p-8 rounded-xl bg-gray-800 text-white max-w-sm w-full shadow-lg'>
        <h1 className='text-3xl font-bold mb-6'>Sign in to AspAIre</h1>

        <Button
          variant='outline'
          className='border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
          onClick={() => signIn('github', { callbackUrl })}
        >
          Sign in with GitHub
        </Button>
      </div>
    </main>
  );
}
