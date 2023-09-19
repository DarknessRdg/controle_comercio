"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Adjust as needed
        references: {
          model: "employees", // The name of the referenced model
          key: "id", // The primary key of the referenced model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Adjust as needed
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Adjust as needed
        references: {
          model: "clients", // The name of the referenced model
          key: "id", // The primary key of the referenced model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Adjust as needed
      },
      deletedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("orders");
  },
};
