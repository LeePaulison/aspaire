// lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const http = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, credentials: 'include' });

// pull JWT (or session) into the header when available
const auth = setContext(async (_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
});

export const apolloClient = new ApolloClient({
  link: auth.concat(http),
  cache: new InMemoryCache({
    // add typePolicies later if you paginate in Apollo
  }),
});
