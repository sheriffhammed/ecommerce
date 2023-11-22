'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',        // Name of the referenced table
          key: 'id',             // Primary key in the referenced table
        },
        onUpdate: 'CASCADE',     // Optional: Cascade update/delete
        onDelete: 'CASCADE',     // Optional: Cascade update/delete
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Permissions',  // Name of the referenced table
          key: 'id',             // Primary key in the referenced table
        },
        onUpdate: 'CASCADE',     // Optional: Cascade update/delete
        onDelete: 'CASCADE',     // Optional: Cascade update/delete
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RolePermissions');
  }
};