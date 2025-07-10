'use client';
// Next Auth imports
import { SessionProvider } from 'next-auth/react';
// Next-Theme imports
import { ThemeProvider } from './themeProvider';
// Apollo Client imports
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';

export function AppProvider({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} disableTransitionOnChange={true}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
