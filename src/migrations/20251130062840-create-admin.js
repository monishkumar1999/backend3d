'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Admin', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
       type: Sequelize.STRING,
       allowNull: false
      },
      action:{
        type:Sequelize.ENUM('0','1')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Admin');
  }
};
