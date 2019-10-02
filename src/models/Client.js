const Sequelize = require('sequelize')
const sequelize = require('./Connection')


const Client = sequelize.define('client', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    deletedAt: {
        type: Sequelize.DATE
    }
}, {paranoid: true})


const ClientPhone = sequelize.define('clientPhone', {
    fone: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


const ClientAddress = sequelize.define('clientAddress', {
    neighborhood: {
        type: Sequelize.STRING,
        allowNull: false
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

// relations: 1..N 
ClientAddress.belongsTo(Client, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
ClientPhone.belongsTo(Client, {foreignKey: {allowNull: false}, onDelete: 'cascade'})


module.exports = {Client,  ClientPhone, ClientAddress}