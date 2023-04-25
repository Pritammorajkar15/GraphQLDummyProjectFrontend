//  gql: function to parse the mutation string into a GraphQL document that you then pass to useMutation.
// useLazyQuery: it does not immediately execute its associated query. Instead, it returns a query function in its result tuple that you call whenever you're ready to execute the query.
// subscriptions usually maintain a persistent connection,Apollo Client subscriptions most commonly communicate over WebSocket, via the graphql-ws library.
import React, { useState, useMemo } from "react";
import {
  useQuery,
  useLazyQuery,
  gql,
  useMutation,
  useSubscription,
} from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

const USER_ADDED_SUBSCRIPTION = gql`
  subscription {
    userAdded {
      id
      name
      age
      username
      nationality
    }
  }
`;

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const { data: subscriptionData } = useSubscription(USER_ADDED_SUBSCRIPTION);

  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const memoizedUserData = useMemo(() => {
    if (subscriptionData) {
      return [...data.users, subscriptionData.userAdded]; // Merge the subscription data with the query data
    }
    return data;
  }, [data, subscriptionData]);
  const memoizedMovieData = useMemo(() => movieData, [movieData]);
  const memoizedMovieSearchedData = useMemo(
    () => movieSearchedData,
    [movieSearchedData]
  );

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  if (loading) {
    return <h1> DATA IS LOADING...</h1>;
  }

  return (
    <div className="container">
      <div style={{ paddingTop: "10px" }}>
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>
      {memoizedUserData &&
        memoizedUserData.users.map((user) => {
          return (
            <div>
              <h1>Name: {user.name}</h1>
              <h1>Username: {user.username}</h1>
              <h1>Age: {user.age}</h1>
              <h1>Nationality: {user.nationality}</h1>
            </div>
          );
        })}

      {memoizedMovieData &&
        memoizedMovieData.movies.map((movie) => {
          return <h1>Movie Name: {movie.name}</h1>;
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {memoizedMovieSearchedData && (
            <div>
              <h1>MovieName: {memoizedMovieSearchedData.movie.name}</h1>
              <h1>
                Year Of Publication:{" "}
                {memoizedMovieSearchedData.movie.yearOfPublication}
              </h1>{" "}
            </div>
          )}
          {movieError && <h1> There was an error fetching the data</h1>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
