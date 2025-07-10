import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql', // Adjust this to your GraphQL endpoint
    credentials: 'include', // if you’re using cookies for auth
  }),
  cache: new InMemoryCache(),
});

export default client;
