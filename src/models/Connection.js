const Sequelize = require("sequelize");
const envConfigs = require("../config");
const config = envConfigs.development;

const sequelize = new Sequelize(config.database, "postgres", config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

module.exports = sequelize;
