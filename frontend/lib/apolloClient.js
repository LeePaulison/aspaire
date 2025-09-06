// lib/apolloClient.js
'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

console.log('GraphQL URL:', process.env.NEXT_PUBLIC_GRAPHQL_URL);

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext(async (_, { headers }) => {
  console.log('[Apollo] Auth link triggered');
  const session = await getSession(); // pulls from next-auth
  
  console.log('[Apollo] NextAuth session:', JSON.stringify(session, null, 2));
  
  // If no session, don't include authorization header
  if (!session?.user) {
    console.log('[Apollo] No session found, skipping auth header');
    return {
      headers: {
        ...headers,
      },
    };
  }

  try {
    // Get database user ID from user store
    let dbUserId = null;
    try {
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        const parsed = JSON.parse(userStorage);
        dbUserId = parsed.state?.user?.id;
      }
    } catch (storageError) {
      console.warn('[Apollo] Could not access user storage:', storageError.message);
    }

    if (!dbUserId) {
      console.warn('[Apollo] No database user ID found in storage');
      return {
        headers: {
          ...headers,
        },
      };
    }

    console.log('[Apollo] Database user ID from storage:', dbUserId);
    console.log('[Apollo] Fetching JWT token from /api/auth/token');
    
    // Fetch JWT token from our API endpoint with database user ID
    const response = await fetch(`/api/auth/token?userId=${encodeURIComponent(dbUserId)}`);
    console.log('[Apollo] Token response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('[Apollo] Failed to fetch JWT token:', response.status, errorText);
      return {
        headers: {
          ...headers,
        },
      };
    }
    
    const responseData = await response.json();
    console.log('[Apollo] Token response data:', responseData);
    
    const { token } = responseData;
    console.log('[Apollo] Using JWT token:', token?.substring(0, 20) + '...');
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.error('[Apollo] Error fetching JWT token:', error);
    return {
      headers: {
        ...headers,
      },
    };
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
