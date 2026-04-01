declare module "apollo-upload-client" {
  import { ApolloLink } from "@apollo/client";

  export interface UploadLinkOptions {
    uri?: string;
    credentials?: RequestCredentials;
    fetchOptions?: RequestInit;
    headers?: Record<string, string>;
    useGETForQueries?: boolean;
    includeExtensions?: boolean;
    includeUnusedVariables?: boolean;
    [key: string]: any;
  }

  export function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}

declare module "apollo-upload-client/public/createUploadLink.js" {
  import { ApolloLink } from "@apollo/client";
  export default function createUploadLink(options?: Record<string, any>): ApolloLink;
}
