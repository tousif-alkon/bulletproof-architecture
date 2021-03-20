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
  avatar: String!
  bio: String
}
type Mutation {
  createBook(title: String!, summary: String!, content: String!): Book @isAuthenticated
  createReview(book: ID!, content: String!, rating: Int!): Review @isAuthenticated
  deleteBook(id: ID!): ID @isAuthenticated
  deleteReview(id: ID!): Review @isAuthenticated
  signin(email: String!, password: String!): AuthData
  signup(name: String!, email: String!, password: String!): User
  updateBook(id: ID!, title: String!, summary: String!, content: String!): Book @isAuthenticated
  updateMe(file: Upload, name: String!, bio: String): User! @isAuthenticated
  updateReview(id: ID!, content: String!, rating: Int!): Review @isAuthenticated
}
type Query {
  book(id: ID!): Book
  books(first: Int, after: String, last: Int, before: String, search: String): BookConnection!
  me: User @isAuthenticated
  review(id: ID!): Review
  reviews(first: Int!, after: String, where: ReviewsWhereInput, orderBy: ReviewOrder = created_DESC): ReviewConnection!
  user(id: ID!): User
}
type Book {
  id: ID!
  title: String!
  author: User!
  summary: String!
  content: String!
  ratingsAverage: Float!
  ratingsQuantity: Int!
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
type Review {
  id: ID!
  book: Book!
  author: User!
  content: String!
  rating: Int!
  created: DateTime!
}
type ReviewConnection {
  edges: [ReviewEdge!]!
  nodes: [Review!]!
  pageInfo: PageInfo!
}
type ReviewEdge {
  node: Review!
  cursor: String!
}
enum ReviewOrder {
  created_ASC
  created_DESC
  rating_ASC
  rating_DESC
}
input ReviewsWhereInput {
  book: String
  author: String
}
scalar DateTime
scalar Date
scalar Time
scalar Upload
type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
type File {
  id: String!
  path: String!
  filename: String!
  mimetype: String!
}
directive @isAuthenticated on FIELD_DEFINITION
`