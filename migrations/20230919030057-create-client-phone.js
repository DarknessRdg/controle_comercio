"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clientPhones", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientId: {
        // This is the foreign key field
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clients", // The name of the referenced model
          key: "id", // The primary key of the referenced model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // This ensures that if a client is deleted, their phone records are also deleted
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
    await queryInterface.dropTable("clientPhones");
  },
};
