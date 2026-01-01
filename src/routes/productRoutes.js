import express from "express";
import multer from "multer";
import path from "path";
import { createProduct, getProductBySlug, getProductsList } from "../controllers/productController.js";
import { saveUserDesign, getDesignById, getUserDesigns } from "../controllers/designController.js";
import fs from 'fs';
import upload from "../middleware/admin/upload.js";
import designUpload from "../middleware/designUpload.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/products/';
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


// POST /api/products/create - Admin Only
router.post("/create", authenticate, authorize("admin"), upload.any(), createProduct);

// GET /api/products/list - Admin and Customer
router.get("/list", authenticate, authorize("admin", "customer"), getProductsList);

// Design Routes
// Design Routes - Customer Only for saving
// POST /api/product/save-design
router.post("/save-design", authenticate, authorize("customer"), designUpload.any(), saveUserDesign);

// GET /api/product/design/:id
router.get("/design/:id", authenticate, authorize("customer", "admin"), getDesignById);

// GET /api/product/designs
router.get("/designs", authenticate, authorize("customer"), getUserDesigns);

// GET /api/products/:slug (Dynamic route should be last) - Admin and Customer
router.get("/:slug", authenticate, authorize("admin", "customer"), getProductBySlug);

export default router;
