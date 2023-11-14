require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const connectToMongoDB = require('./src/connectors/mongodb');


const MONGODB = process.env.MONGODB;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

connectToMongoDB(MONGODB)
    .then(() => {
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch((err) => {
        console.error(err);
        console.log('error');
    });
