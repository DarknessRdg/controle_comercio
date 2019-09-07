const Sequelize = require('sequelize')

const sequelize = new Sequelize('db_sistema_comercio', 'postgres', 'Newera1.0', {
  host: 'localhost',
  dialect: 'postgres'
})

module.exports = sequelize;

