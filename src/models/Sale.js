const Sequelize = require('sequelize')
const sequelize = require('./Connection')

const { Employee } = require('./Employee')
const { Client } = require('./Client')
const { Product } = require('./Product')


const Sale = sequelize.define('sale', {
    paga: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {paranoid: true})

Sale.belongsTo(Employee, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'cascade'
})

Sale.belongsTo(Client, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'cascade'
})


const Order = sequelize.define('order', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    product_price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
})

Order.belongsTo(Sale, {
    foreignKey: {allowNull: false}, 
    onDelete: 'cascade'
})

Order.belongsTo(Product, {
    foreignKey: {allowNull: false}, 
    onDelete: 'cascade'
})


module.exports = { Sale, Order }