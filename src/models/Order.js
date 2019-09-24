const Sequelize = require('sequelize')
const sequelize = require('./Connection')

const { Employee } = require('./Employee')
const { Client } = require('./Client')
const { Product } = require('./Product')


const Order = sequelize.define('order', {
    paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {paranoid: true})

Order.belongsTo(Employee, {
    foreignKey: {
        allowNull: true
    },
    onDelete: 'cascade'
})

Order.belongsTo(Client, {
    foreignKey: {
        allowNull: true
    },
    onDelete: 'cascade'
})


const OrderProduct = sequelize.define('orderProduct', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    productPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
})

OrderProduct.belongsTo(Order, {
    foreignKey: {allowNull: false}, 
    onDelete: 'cascade'
})

OrderProduct.belongsTo(Product, {
    foreignKey: {allowNull: false}, 
    onDelete: 'cascade'
})



module.exports = { OrderProduct, Order }