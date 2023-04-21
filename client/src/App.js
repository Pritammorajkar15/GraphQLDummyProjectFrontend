// ApolloClient: configure and connect graphQL API.
// InMemoryCache: caches the data received from graphQL API.
// ApolloProvider: is a HOC that wraps around the root component and provides Apollo client instance.
import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import DisplayData from "./Display";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql",
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <DisplayData />
      </div>
    </ApolloProvider>
  );
}

export default App;