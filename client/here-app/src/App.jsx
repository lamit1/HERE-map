import React, { useEffect, useState } from 'react';
import HEREMap from './layout/Map';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

function App() {
  const client = new ApolloClient({
    uri: 'https://graphql.aws.mapquest.com/',
    cache: new InMemoryCache(),
  });
  const apiKey = import.meta.env.VITE_API_KEY
  return (
    <ApolloProvider client={client}>
      <HEREMap apikey={apiKey} />
    </ApolloProvider>
  );
}

export default App;
