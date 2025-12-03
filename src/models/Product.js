import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., "Classic Mens T-Shirt"',
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'URL friendly name for customer access',
  },
  base_model_url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The URL to the raw .glb file',
  },
  configuration: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Stores stickerZones, materialZones, variantGroups, globalTransform',
  },
  thumbnail_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Preview image of the product',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true, 
  tableName: 'products',
});

export default Product;
