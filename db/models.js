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


const SmokeCircleParticipation = database.define("SmokeCircleParticipation", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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

SmokeCircle.belongsTo(Smoker, { as: "starter" });
Smoker.belongsToMany(SmokeCircle, { through: { model: SmokeCircleParticipation, unique: false } });
SmokeCircle.belongsToMany(Smoker, { through: { model: SmokeCircleParticipation, unique: false } });



exports.Smoker = Smoker;
exports.SmokeCircleParticipation = SmokeCircleParticipation;
exports.SmokeCircle = SmokeCircle; 