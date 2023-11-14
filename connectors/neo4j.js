const neo4j = require("neo4j-driver");
const driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'Cr7vslm10'));

const verification = async () => {
    try {
        await driver.verifyConnectivity();
        console.log("Neo4j connected");
    } catch (error) {
        console.error("Error connecting to Neo4j:", error.message);
        throw error; // rethrow the error to handle it outside
    }
};

verification();

module.exports = { driver };
