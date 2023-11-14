require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const connectToMongoDB = require('./src/connectors/mongodb');


const MONGODB = "mongodb+srv://satyam:3Fnqpee7tzr0Xn2r@cluster0.d9a4epx.mongodb.net/?retryWrites=true&w=majority";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

connectToMongoDB(MONGODB)
    .then(() => {
        return server.listen({ port: 80 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch((err) => {
        console.error(err);
        console.log('error');
    });
