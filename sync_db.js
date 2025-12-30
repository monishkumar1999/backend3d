import { sequelize, UserDesign, Product, ProductMesh, Category, SubCategory, Admin } from './src/models/index.js';


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
