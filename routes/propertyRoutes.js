import express from 'express';
import { getAllProperties, addProperty } from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getAllProperties);
router.post('/', addProperty);

export default router; // ✅ THIS IS REQUIRED