import express from "express";
import { saveUserDesign, getDesignById, getUserDesigns } from "../controllers/designController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/designs", authenticate, authorize("customer"), getUserDesigns);
router.post("/save-design", authenticate, authorize("customer"), saveUserDesign);
router.get("/:id", authenticate, authorize("customer", "admin"), getDesignById);

export default router;
