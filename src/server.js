import express from "express";
import cors from "cors";
import adminRoutes from "./routes/AdminRoutes.js";
import productRoute from "./routes/productRoutes.js";
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/admin", adminRoutes);
app.use("/products",productRoute);
app.use("/api/upload", uploadRoutes);  
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
sequelize.authenticate()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));