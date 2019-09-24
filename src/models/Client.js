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
        type: Sequelize.DATEONLY
    },
    deletedAt: {
        type: Sequelize.DATE
    }
}, {paranoid: true})


const ClientFone = sequelize.define('clientFone', {
    fone: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


const ClientAddress = sequelize.define('clientAddress', {
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
ClientFone.belongsTo(Client, {foreignKey: {allowNull: false}, onDelete: 'cascade'})


module.exports = {Client,  ClientFone, ClientAddress}