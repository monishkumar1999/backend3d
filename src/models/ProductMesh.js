import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";
import Product from './Product.js';

const ProductMesh = sequelize.define('ProductMesh', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    meshName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Name of the mesh this SVG applies to (e.g., front_body)',
    },
    whiteMaskPath: {
        type: DataTypes.STRING,
        allowNull: true, // It might be possible to have only one of them? Assuming usually required but keeping flexible for now.
        comment: 'Path to the white mask SVG',
    },
    originalSvgPath: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Path to the original wireframe SVG',
    },
}, {
    timestamps: true, // Maybe not strictly needed but good for tracking
    tableName: 'product_meshes',
});

// Define association
Product.hasMany(ProductMesh, { foreignKey: 'productId', as: 'meshes' });
ProductMesh.belongsTo(Product, { foreignKey: 'productId' });

export default ProductMesh;
