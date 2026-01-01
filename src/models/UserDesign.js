import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";
import Product from './Product.js';

const UserDesign = sequelize.define('UserDesign', {
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
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Customer',
            key: 'id',
        },
    },
    // This stores the meshColors, meshStickers, and materialSettings
    designData: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Stores colors, stickers, and material properties like roughness/metalness',
    },
    // Useful if you want to allow users to name their saved designs
    designName: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'user_designs',
});

// Product.hasMany(UserDesign, { foreignKey: 'productId', as: 'savedDesigns' });
// UserDesign.belongsTo(Product, { foreignKey: 'productId' });

// Association with Customer
// UserDesign.belongsTo(sequelize.models.Customer, { foreignKey: 'customerId', as: 'Customer' });

export default UserDesign;