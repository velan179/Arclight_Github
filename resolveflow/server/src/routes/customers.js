import { Router } from 'express';
import customerController from '../controllers/customerController.js';

const router = Router();

router.get('/:id', (req, res) => customerController.getById(req, res));

export default router;
