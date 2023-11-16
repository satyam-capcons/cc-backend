const neo4j = require("neo4j-driver");
const driver = neo4j.driver('neo4j+s://2e2cb04b.databases.neo4j.io', neo4j.auth.basic('neo4j', 'Qzy-3_xxK_oqdqvRKvueYMdVOz-YxxVcXDXSzhDlX1o'));

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
