import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken');
  
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;

