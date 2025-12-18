
import express from 'express';
import authMiddleware from '../middleware/admin/authMiddleware.js';
import { createCategory, editCategory, viewCategory } from '../controllers/product/categoryController.js';

const router=express.Router();
router.get('/view',authMiddleware,viewCategory);

router.post('/create',authMiddleware,createCategory);
router.put('/edit',authMiddleware,editCategory);


export default router;