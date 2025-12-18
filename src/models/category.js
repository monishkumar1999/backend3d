import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define associations here
      Category.hasMany(models.SubCategory, {
        foreignKey: 'categoryId',
        as: 'subCategories', // alias for accessing subcategories
        onDelete: 'CASCADE',
      });
    }
  }

  Category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      action: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '1'
      }
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Category',
      timestamps: true
    }
  );

  return Category;
};
