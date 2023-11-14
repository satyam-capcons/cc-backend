require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const connectToMongoDB = require('./connectors/mongodb');


const MONGODB = process.env.MONGODB;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

console.log('fjdlkj');
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
