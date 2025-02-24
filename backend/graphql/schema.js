const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    email: String!
    profilePicture: String
    token: String
  }

  type AuthData {
    userId: ID!
    token: String!
  }

  type Query {
    getProfile: User
  }

  type Mutation {
    register(email: String!, password: String!, profilePicture: Upload): User
    login(email: String!, password: String!): AuthData
  }
`;

module.exports = typeDefs;
