'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LuMenu } from "react-icons/lu";

export function UserMenu({ user, onSignOut, onSignIn }) {
  const isDisabled = !user;

  return (
    <DropdownMenu>
      {/* Top-level trigger as native button */}
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

        {/* Dashboard link as native <a> via asChild */}
        <DropdownMenuItem asChild disabled={isDisabled}>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>

        {/* Submenu trigger as native <button> via asChild */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={isDisabled}
            className={isDisabled
              ? "text-muted-foreground cursor-not-allowed opacity-70"
              : ""
            }
          >
            Profile
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem asChild disabled={isDisabled}>
              <Link href='/profile'>Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={isDisabled}>
              <Link href='/profile/resumes'>Resumes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={isDisabled}>
              <Link href='/profile/settings'>Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Sign in/out item as normal */}
        <DropdownMenuItem onClick={user ? onSignOut : onSignIn}>
          {user ? 'Sign out' : 'Sign in'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
