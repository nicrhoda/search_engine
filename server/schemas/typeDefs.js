const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}

type Mutation {
    login(username: String!, email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input:): User
    removeBook(bookId: ):User
}

type User {
    _id: 
    username: String!
    email: String!
    bookCount: ID!
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    title: String
}

input SavedBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: Strin
}

type Auth {
    token: ID!
    user: User
}
`;

module.exports = typeDefs;