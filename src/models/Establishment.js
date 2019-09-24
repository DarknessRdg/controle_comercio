const Sequelize = require('sequelize')
const sequelize = require('./Connection')


const Establishment = sequelize.define('establishment', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    street: {
        type: Sequelize.STRING,
        allowNull: false
    },
    number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cep: {
        type: Sequelize.STRING,
        allowNull: false
    },
    complement: {
        type: Sequelize.STRING
    },
})

module.exports = { Establishment }