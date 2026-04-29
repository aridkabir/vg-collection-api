import express from 'express';
import * as platformController from '../controllers/platformController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', platformController.getAllPlatforms);
router.get('/:id', platformController.getPlatformById);
router.post('/', authenticateToken, authorizeAdmin, platformController.createPlatform);
router.put('/:id', authenticateToken, authorizeAdmin, platformController.updatePlatform);
router.delete('/:id', authenticateToken, authorizeAdmin, platformController.deletePlatform);

export default router;