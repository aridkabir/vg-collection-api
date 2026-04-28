import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.post('/', authenticateToken, authorizeAdmin, gameController.createGame);
router.put('/:id', authenticateToken, authorizeAdmin, gameController.updateGame);
router.delete('/:id', authenticateToken, authorizeAdmin, gameController.deleteGame);

export default router;