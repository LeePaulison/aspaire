'use client';
// Next-Auth imports
import { useSession, signIn, signOut } from 'next-auth/react';
// Shadcn UI components
import { Button } from '@/components/ui/button'
// Theme toggle component
import { ModeToggle as ThemeToggle } from '@/components/themeToggle'

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className='container flex flex-row items-center justify-between w-full py-2 px-4 border-b border-b-muted'>
      <h1 className='text-xl font-bold'>AspAIre</h1>
      <div className='flex items-center space-x-4'>
        <ThemeToggle />

        {/* Authentication buttons */}
        {status === 'authenticated' ? (
          <Button variant='outline'
            className='border-accent text-accent hover:bg-accent hover:text-accent-foreground'
            onClick={() => signOut()}
          >Sign Out</Button>
        ) : (
          <Button variant='outline'
            className='border-accent text-accent hover:bg-accent hover:text-accent-foreground'
            onClick={() => signIn()}
          >Sign In</Button>
        )}
      </div>
    </header>
  )
}