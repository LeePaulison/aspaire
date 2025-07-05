'use client';
// Next JS imports
import Link from 'next/link';
// Next Auth imports
import { signIn } from 'next-auth/react';
// Next Router imports
import { useSearchParams } from 'next/navigation';
// Shadcn UI imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <main className='flex items-center justify-center w-full h-full'>
      <Card className='card p-8 rounded-xl max-w-sm w-full shadow-lg my-auto'>
        <h1 className='text-3xl font-bold mb-6 mx-auto'>Sign In</h1>
        <p className='text-muted-foreground mb-6 text-center'>Sign in to your account to continue.</p>

        <div className='flex flex-row items-center space-x-4 ms-auto'>
          <Link href={callbackUrl}>
            <Button
              variant='outline'
              asChild
              className='border-muted text-accent hover:bg-accent hover:text-accent-foreground'
            >
              <span>Cancel</span>
            </Button>
          </Link>
          <Button
            variant='outline'
            className='border-muted text-accent hover:bg-accent hover:text-accent-foreground'
            onClick={() => signIn('github', { callbackUrl })}
          >
            GitHub
          </Button>
        </div>
      </Card>
    </main>
  );
}
