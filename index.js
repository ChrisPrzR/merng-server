const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');


const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect( MONGODB, { useNewUrlParser: true })
    .then(()=>{
        console.log('DB Connected')
        return server.listen({port: PORT})
    })
    .then(res => {
        console.log(`Server running on ${res.url}`)
    })
    .catch(err => {
        console.log(err)
    })