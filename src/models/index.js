import Sequelize from "sequelize";
import sequelize from "../config/db.js";

import Admin from "./Admin.js";
import CategoryModel from "./category.js";
import SubCategoryModel from "./SubCategory.js";
import UserDesign from "./UserDesign.js";
import Product from "./Product.js";
import ProductMesh from "./ProductMesh.js";
import Customer from "./Customer.js";

// Category uses factory style
const Category = CategoryModel(sequelize, Sequelize.DataTypes);
const SubCategory = SubCategoryModel(sequelize, Sequelize.DataTypes);

// Set up associations
if (Category.associate) {
    Category.associate({ SubCategory });
}
if (SubCategory.associate) {
    SubCategory.associate({ Category });
}

// UserDesign associations
Product.hasMany(UserDesign, { foreignKey: 'productId', as: 'savedDesigns' });
UserDesign.belongsTo(Product, { foreignKey: 'productId' });
UserDesign.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });
Customer.hasMany(UserDesign, { foreignKey: 'customerId', as: 'Designs' });

export { sequelize, Admin, Category, SubCategory, UserDesign, Product, ProductMesh, Customer };
