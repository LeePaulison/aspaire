import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

console.log('Apollo Client Initialized');

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // Adjust this to your GraphQL endpoint
    credentials: 'include', // if you’re using cookies for auth
  }),
  cache: new InMemoryCache(),
});

export default client;
