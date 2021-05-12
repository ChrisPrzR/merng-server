const { gql } = require('apollo-server');

module.exports = gql `
    type Post {
        id: ID!
        body: String!
        image: String
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }

    type User{
        id: ID!
        email: String!
        image: String
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput{
        username: String!
        password: String!
        imageURL: String!
        confirmPassword: String!
        email: String!
    }

    input RecoverPassword {
        email: String!
    }

    input ResetInput{
        username: String!
        password: String!
        confirmPassword: String!
        token: String!
    }

    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
    }

    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        recover(email: String!): String
        passwordReset(username: String!, password: String!, confirmPassword: String!, token: String!): String
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post! 
    }
`;
