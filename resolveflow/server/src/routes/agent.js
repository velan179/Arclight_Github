import { Router } from 'express';
import agentController from '../controllers/agentController.js';

const router = Router();

router.post('/run', (req, res) => agentController.run(req, res));
router.get('/runs/:id', (req, res) => agentController.getRunById(req, res));
router.get('/runs/:id/events', (req, res) => agentController.getRunEvents(req, res));

export default router;
