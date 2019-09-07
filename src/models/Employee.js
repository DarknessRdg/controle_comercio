const Sequelize = require('sequelize')
const sequelize = require('./Connection')


const Employee = sequelize.define('employee', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
    },
    cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        isNumeric: true
    },
    data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
}, {paranoid: true})


module.exports = { Employee }