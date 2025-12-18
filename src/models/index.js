import Sequelize from "sequelize";
import sequelize from "../config/db.js";

import Admin from "./Admin.js";
import CategoryModel from "./category.js";
import SubCategoryModel from "./SubCategory.js";

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

export { sequelize, Admin, Category, SubCategory };
