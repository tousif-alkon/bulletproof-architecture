// Do not edit directly!
export default `
schema {
  query: Query
  mutation: Mutation
}
type AuthData {
  user: User!
  accessToken: String!
  refreshToken: String!
}
type User {
  id: ID!
  name: String!
  email: String
  joined: DateTime!
}
type Mutation {
  createBook(title: String!): Book @isAuthenticated
  deleteBook(id: ID!): ID @isAuthenticated
  signin(email: String!, password: String!): AuthData
  signup(name: String!, email: String!, password: String!): User
  updateBook(id: ID!, title: String!): Book @isAuthenticated
}
type Query {
  book(id: ID!): Book
  books(after: String, first: Int!, where: BooksWhereInput): BookConnection!
  me: User @isAuthenticated
}
type Book {
  id: ID!
  title: String!
  author: User!
  created: DateTime!
  lastChanged: DateTime!
}
type BookConnection {
  edges: [BookEdge!]!
  nodes: [Book!]!
  pageInfo: PageInfo!
}
type BookEdge {
  node: Book!
  cursor: String!
}
input BooksWhereInput {
  _id: String
}
scalar DateTime
scalar Date
scalar Time
type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
directive @isAuthenticated on FIELD_DEFINITION
`