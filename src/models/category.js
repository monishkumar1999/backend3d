import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define associations here (later)
      // example:
      // Category.hasMany(models.Product, { foreignKey: 'category_id' });
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
