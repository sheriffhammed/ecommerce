'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.changeColumn(
      'users',
      'phone',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0.0
      }
    ),
    queryInterface.addColumn(
      'users',
      'refreshToken',
      Sequelize.TEXT
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.changeColumn(
      'users',
      'phone',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0.0
      }
    ),
    queryInterface.addColumn(
      'users',
      'refreshToken',
      Sequelize.TEXT
    )
  }
};
