import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    action: {
      type: DataTypes.ENUM("0", "1"),
      defaultValue: "0",
    },
  },
  {
    tableName: "Admin",
    timestamps: true,
  }
);

export default Admin;
