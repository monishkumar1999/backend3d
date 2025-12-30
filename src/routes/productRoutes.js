import express from "express";
import multer from "multer";
import path from "path";
import { createProduct, getProductBySlug, getProductsList } from "../controllers/productController.js";
import { saveUserDesign, getDesignById, getUserDesigns } from "../controllers/designController.js";
import fs from 'fs';
import upload from "../middleware/admin/upload.js";

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


// POST /api/products/create
router.post("/create", upload.any(), createProduct);

// GET /api/products/list
router.get("/list", getProductsList);

// Design Routes
// POST /api/product/save-design
router.post("/save-design", upload.any(), saveUserDesign);

// GET /api/product/design/:id
router.get("/design/:id", getDesignById);

// GET /api/product/designs
router.get("/designs", getUserDesigns);

// GET /api/products/:slug (Dynamic route should be last)
router.get("/:slug", getProductBySlug);

export default router;
