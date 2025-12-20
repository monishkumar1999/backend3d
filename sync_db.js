import sequelize from './src/config/db.js';
import Product from './src/models/Product.js';
import ProductMesh from './src/models/ProductMesh.js';

const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing database:", error);
        process.exit(1);
    }
};

syncDB();
