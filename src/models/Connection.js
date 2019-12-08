const Sequelize = require('sequelize')
const config = require('../config');

const sequelize = new Sequelize(config.DB_NAME, 'postgres', config.PASSWORD, {
  host: config.HOST,
  dialect: 'postgres'
})

module.exports = sequelize;

