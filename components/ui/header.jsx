import React from 'react'

import { ModeToggle as ThemeToggle } from '@/components/themeToggle'

export function Header() {
  return (
    <header className='flex items-center justify-between py-2 px-4'>
      <h1 className='text-xl font-bold'>AspAIre</h1>
      <ThemeToggle />
    </header>
  )
}