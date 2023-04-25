// ApolloClient: configure and connect graphQL API.
// InMemoryCache: caches the data received from graphQL API.
// ApolloProvider: is a HOC that wraps around the root component and provides Apollo client instance.
import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink, split } from "@apollo/client";
import DisplayData from "./Display";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Create an http link
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

// Split the link based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

function App() {
  const client = new ApolloClient({
    link: splitLink,
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