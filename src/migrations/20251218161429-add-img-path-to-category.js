'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Category', 'img_path', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'name' // optional (works in MySQL)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Category', 'img_path');
  }
};
