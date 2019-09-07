const Sequelize = require('sequelize')
const sequelize = require('./Connection')


const Product = sequelize.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
    },
    bar_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        isNumeric: true
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    isCombo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: '0'     
    }
}, {paranoid: true})


const ComboProducts = sequelize.define('comboProducts', {

})

ComboProducts.belongsTo(Product, {
    as: 'products',
    foreignKey: {
        allowNull: false
    }
})

ComboProducts.belongsTo(Product, {
    as: 'combo',
    foreignKey: {
        allowNull: false
    }
})


module.exports = { Product, ComboProducts }