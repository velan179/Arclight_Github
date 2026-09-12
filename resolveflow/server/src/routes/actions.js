import { Router } from 'express';
import actionsController from '../controllers/actionsController.js';

const router = Router();

router.post('/refund', (req, res) => actionsController.refund(req, res));
router.post('/replacement', (req, res) => actionsController.replacement(req, res));
router.post('/cancel', (req, res) => actionsController.cancel(req, res));

export default router;
