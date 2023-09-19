'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orderProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      productPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders', // The name of the referenced model
          key: 'id'        // The primary key of the referenced model
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Adjust as needed
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products', // The name of the referenced model
          key: 'id'          // The primary key of the referenced model
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Adjust as needed
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orderProducts');
  }
};
