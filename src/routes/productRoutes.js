import express from "express";
import multer from "multer";
import path from "path";
import { createProduct, getProductBySlug, getProductsList } from "../controllers/productController.js";
import fs from 'fs';

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

const upload = multer({ storage: storage });

// POST /api/products/create
router.post("/create", upload.any(), createProduct);

// GET /api/products/list
router.get("/list", getProductsList);

// GET /api/products/:slug
router.get("/:slug", getProductBySlug);

export default router;
