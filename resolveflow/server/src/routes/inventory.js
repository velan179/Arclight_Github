import { Router } from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = Router();

router.get('/:id/availability', (req, res) => inventoryController.getAvailability(req, res));
router.get('/:productId', (req, res) => inventoryController.getAvailability(req, res));
router.post('/chaos', (req, res) => inventoryController.updateChaos(req, res));

export default router;
