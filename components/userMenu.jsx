'use client';
// Next Navigation imports
import Link from 'next/link';
// Shadcn UI components for user menu
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Luside icons
import { LuMenu } from "react-icons/lu";


export function UserMenu({ user, onSignOut, onSignIn }) {
  const isDisabled = !user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <LuMenu className='h-5 w-5' />
          <span className='sr-only'>Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='font-semibold'>
          {user ? `Hello, ${user.name || user.email}` : 'Welcome!'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Add more menu items as needed */}
        <DropdownMenuItem asChild disabled={isDisabled}>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={isDisabled}>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={user ? onSignOut : onSignIn}>{user ? 'Sign out' : 'Log in'}</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}