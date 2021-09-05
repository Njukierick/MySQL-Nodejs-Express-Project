const env = require("./.env");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customers = require("../models/customer.model.js")(sequelize, Sequelize);
// db.address = require('../model/address.model.js')(sequelize, Sequelize);

// db.address.belongsTo(db.customers, {foreignKey: 'fk_customerid', targetKey: 'uuid'});
// db.customers.hasOne(db.address, {foreignKey: 'fk_customerid', targetKey: 'uuid'});

module.exports = db;
