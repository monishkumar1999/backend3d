import express from "express";
import { saveUserDesign, getDesignById, getUserDesigns } from "../controllers/designController.js";

const router = express.Router();

router.get("/designs", getUserDesigns);
router.post("/save-design", saveUserDesign);
router.get("/:id", getDesignById);

export default router;
