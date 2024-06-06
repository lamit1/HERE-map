import React, { useEffect, useState } from "react";
import HEREMap from "./layout/Map";
import "react-toastify/dist/ReactToastify.min.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { ToastContainer } from "react-toastify";
import useURLParams from "./hooks/useURLParams";
import { InstructionsProvider } from "./layout/contexts/InstructionsContext";
import PrintPage from "./layout/PrintPage";

function App() {
  const client = new ApolloClient({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
  });
  const apiKey = import.meta.env.VITE_API_KEY;


  return (
    <>
      <ToastContainer />
      <ApolloProvider client={client}>
        <HEREMap apikey={apiKey} />
      </ApolloProvider>
    </>
  );
}

export default App;
