const Sequelize = require('sequelize')
const sequelize = require('./Connection')


const ClientAddress = sequelize.define('clientAddress', {
    street: {
        type: Sequelize.STRING
    },
    number: {
        type: Sequelize.INTEGER
    },
    cep: {
        type: Sequelize.STRING
    },
    complement: {
        type: Sequelize.STRING
    },
})

ClientAddress.sync()


const ClientFone = sequelize.define('clientFone', {
    fone: {
        type: Sequelize.STRING
    }
})

ClientFone.associate = function(models) {
    ClientFone.belongsTo(models.Client, {
        as: 'client',
        foreignKey: 'clientId'
    })
}

ClientFone.sync()


const Client = sequelize.define('client', {
    name: {
        type: Sequelize.STRING
    },
    cpf: {
        type: Sequelize.STRING(11)
    },
    birth_date: {
        type: Sequelize.DATEONLY
    },
    fone: {
        type: Sequelize.STRING(16)
    },
    deletedAt: {
        type: Sequelize.DATE
    }
})


Client.associate = function(models) {
    Client.hasMany(models.ClientFone, {
        as: 'fones',
        foreignKey: 'clientFoneId'
    })
}

Client.sync()

module.exports = Client