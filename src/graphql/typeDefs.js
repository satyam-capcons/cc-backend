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

type verifyUser
{
    id:String
    code:String
    expireAt:String

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

input VerifySignUpInput {
    id: String
    code: String
}

type Query {
    message(id: ID!): Message
    user(id: ID!): User
    users: [User]!
}

type Mutation {
    createMessage(messageInput: MessageInput): Message
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
    verifyUser(verifySignUpInput: VerifySignUpInput):verifyUser
}
`