"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comboProducts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products", // The name of the referenced model
          key: "id", // The primary key of the referenced model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // This ensures that if a product is deleted, its combo records are also deleted
      },
      comboId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products", // The name of the referenced model
          key: "id", // The primary key of the referenced model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // This ensures that if a product is deleted, its combo records are also deleted
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comboProducts");
  },
};
