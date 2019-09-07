const Sequelize = require('sequelize')
const sequelize = require('./Connection')

const Funcionarios = sequelize.define('funcionarios', {
    nome: {
        type: Sequelize.STRING
    },
    cpf: {
        type: Sequelize.STRING(11)
    },
    data_nascimento: {
        type: Sequelize.DATEONLY
    }
})



// use only on migrations ! Carefull bcs it drops old table
// Funcionarios.sync({force: true}) 