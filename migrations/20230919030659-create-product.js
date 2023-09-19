'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      barCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
        },
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      isCombo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Use false instead of '0'
      },
      deletedAt: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('products');
  }
};
