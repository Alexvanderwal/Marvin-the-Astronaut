
const Sequelize = require("sequelize");
const config = require("../config");
// const config = require("../config").get(process.env.NODE_ENV);

/**
 * Sequelize object reflecting the connection to the Database.
 */
const database = new Sequelize(config.databasename, null, null, {
    dialect: "sqlite",
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    storage: "./database.sqlite"
});


async function bootDatabase() {
    try {
        await database.authenticate();
        await database.sync();
        console.log("Database connection has been succesfully established");
    } catch (error) {
        console.error("Unable to connect to the database due to", error);
    }
}

bootDatabase();


exports.Sequelize = Sequelize;
exports.database = database;