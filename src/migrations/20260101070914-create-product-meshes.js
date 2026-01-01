'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_meshes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      meshName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the mesh this SVG applies to (e.g., front_body)',
      },

      whiteMaskPath: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Path to the white mask SVG',
      },

      originalSvgPath: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Path to the original wireframe SVG',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_meshes');
  },
};
