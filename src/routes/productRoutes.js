import express from "express";
import { saveProduct, getProductBySlug } from "../controllers/productController.js";

const router = express.Router();

// POST /api/products/save
router.post("/save", saveProduct);

// GET /api/products/:slug
router.get("/:slug", getProductBySlug);

export default router;
