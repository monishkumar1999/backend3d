import express from "express";
import cors from "cors";
import adminRoutes from "./routes/AdminRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js"
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // Import productRoutes
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// UPDATE THIS SECTION
const corsOptions = {
  origin: "http://localhost:5173", // CHANGE THIS to your React Frontend URL (e.g., port 3000 or 5173)
  credentials: true, // This allows cookies to be sent/received
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve static files

app.use("/admin", adminRoutes);

app.use("/admin-category", categoryRoutes);
app.use("/admin-subcategory", subCategoryRoutes);
app.use("/product", productRoutes); // Register product routes
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
sequelize.authenticate()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));