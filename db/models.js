const db = require("./database");
const Sequelize = db.Sequelize;
const database = db.database;

function constructTableSettings(indexes = false, instanceMethods = false) {
    let settings = {
        // Ignores Sequelize's default plural definitions
        freezeTableName: true,
        // Enables optimistic locking. Adds a version count and throws a OptimisticLockingError when stale instances are saves.
        version: true
    };
    // Creates a searchable index for the databases
    if (indexes) {
        settings.indexes = indexes;
    }
    if (instanceMethods) {
        settings.instanceMethods = instanceMethods;
    }
    return settings;
}


SmokeCircleParticipation = database.define("SmokeCircleParticipation", {
    smokingMethod: Sequelize.STRING,
    smokedProduct: Sequelize.STRING
}
)

const Smoker = database.define(
    "smoker", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: false
        }
    }
)

const SmokeCircle = database.define(
    "smokecircle", {}
)

Smoker.belongsToMany(SmokeCircle, { through: SmokeCircleParticipation });
SmokeCircle.belongsToMany(Smoker, { through: SmokeCircleParticipation });



exports.Smoker = Smoker;
exports.SmokeCircle = SmokeCircle; 