const { gql } = require('apollo-server');

module.exports = gql`
type Message {
    text: String
    createdAt: String
    createdBy: String
}

type User {
    username: String!
    email: String
    password: String!
    token: String
    phone: String
}

input MessageInput {
    text: String
    username: String
}

input RegisterInput {
    username: String
    email: String
    password: String
    phone: String
}

input LoginInput {
    email: String
    password: String
}

type Query {
    message(id: ID!): Message
    user(id: ID!): User
    users: [User]!
}

type Mutation {
    createMessage(messageInput: MessageInput): Message!
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
}
`