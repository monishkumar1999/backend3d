import express from "express";
import cors from "cors";
import adminRoutes from "./routes/AdminRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js"
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/admin", adminRoutes);

app.use("/admin-category", categoryRoutes);
app.use("/admin-subcategory", subCategoryRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
sequelize.authenticate()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));