'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'subCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: true, // change to false if required
      references: {
        model: 'SubCategories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'subCategoryId');
  },
};
