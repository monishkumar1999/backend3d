
import express from 'express';
import authMiddleware from '../middleware/admin/authMiddleware.js';

const router=express.Router();

router.post('/create',authMiddleware);

export default router;