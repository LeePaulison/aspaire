'use client';
// Next-Auth imports
import { useSession, signIn, signOut } from 'next-auth/react';
// Shadcn UI components
import { Button } from '@/components/ui/button'
// Theme toggle component
import { ModeToggle as ThemeToggle } from '@/components/themeToggle'

export function Header() {
  const { data: session, status } = useSession();

  console.log('[Header] Session:', session);
  console.log('[Header] Status:', status);

  return (
    <header className='flex items-center justify-between py-2 px-4'>
      <h1 className='text-xl font-bold'>AspAIre</h1>
      <div className='flex items-center space-x-4'>
        <ThemeToggle />

        {/* Authentication buttons */}
        {status === 'authenticated' ? (
          <Button variant='outline'
            className='border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
            onClick={() => signOut()}
          >Sign Out</Button>
        ) : (
          <Button variant='outline'
            className='border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
            onClick={() => signIn()}
          >Sign In</Button>
        )}
      </div>
    </header>
  )
}