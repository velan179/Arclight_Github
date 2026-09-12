import { Router } from 'express';
import orderController from '../controllers/orderController.js';

const router = Router();

router.get('/:id', (req, res) => orderController.getById(req, res));

export default router;
