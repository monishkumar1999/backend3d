import express from "express";
import { createAdmin, login } from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.get("/login",login);
export default router;
