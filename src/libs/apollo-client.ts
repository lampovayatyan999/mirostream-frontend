import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { SERVER_URL, WEBSOCKET_URL } from "./constants/url.constants";
import {WebSocketLink} from '@apollo/client/link/ws'
import { getMainDefinition } from "@apollo/client/utilities";

const uploadLink = createUploadLink({
  uri: SERVER_URL,
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",        
    "x-apollo-operation-name": "ChangeProfileAvatar" 
  },
  fetchOptions: {
    mode: "cors",
  },
});

const wsLink = new WebSocketLink({
  uri: WEBSOCKET_URL,
  options: {
    reconnect: true
  }
})

const splitLink = split(({query}) => {
  const definition = getMainDefinition(query)

  return (
    definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  )
}, wsLink, uploadLink)

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});