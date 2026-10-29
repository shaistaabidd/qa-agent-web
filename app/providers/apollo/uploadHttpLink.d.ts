declare module 'apollo-upload-client/UploadHttpLink.mjs' {
  import { ApolloLink, HttpLink } from '@apollo/client';

  export default class UploadHttpLink extends ApolloLink {
    constructor(options?: HttpLink.Options);
  }
}
