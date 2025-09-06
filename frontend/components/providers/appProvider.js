// app/providers/AppProvider.jsx
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { apolloClient } from '@/lib/apolloClient';
import { queryClient } from '@/lib/reactQueryClient';

export function AppProvider({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </ApolloProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
