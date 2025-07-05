'use client';
// Next-Auth imports
import { useSession, signIn, signOut } from 'next-auth/react';
// Next JS Components
import Image from 'next/image';
import Link from 'next/link';
// Shadcn UI components
import { Button } from '@/components/ui/button'
// Theme toggle component
import { ModeToggle as ThemeToggle } from '@/components/themeToggle'

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className='container flex flex-row items-center justify-between w-full py-2 px-4 border-b border-b-muted'>
      <Link href='/' className='flex items-center space-x-2'>
        <Image src='/assets/icons/favicon.svg' alt="Lee Paulison's Logo" width={40} height={40} priority className='rounded-full' />
      </Link>
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