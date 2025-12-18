import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SubCategory extends Model {
    static associate(models) {
      // define association here
      SubCategory.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE', 
      });
    }
  }

  SubCategory.init(
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Category', // Matches the tableName in Category model
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'SubCategory',
      tableName: 'SubCategories',
      timestamps: true
    }
  );

  return SubCategory;
};
