'use client';
// Next Auth imports
import { SessionProvider } from 'next-auth/react';
// Next-Theme imports
import { ThemeProvider } from './themeProvider';

export function AppProvider({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} disableTransitionOnChange={true}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
