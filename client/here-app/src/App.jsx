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
import ArticleScreen from "./components/article/ArticleScreen";

function App() {
  const client = new ApolloClient({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
  });
  const apiKey = import.meta.env.VITE_API_KEY;

  const { path, params } = useURLParams();

  return (
    <>
      <ToastContainer />
      <ApolloProvider client={client}>
        {path.startsWith("/article") ? (
          <ArticleScreen />
        ) : (
          <HEREMap apikey={apiKey} />
        )}
      </ApolloProvider>
    </>
  );
}

export default App;
