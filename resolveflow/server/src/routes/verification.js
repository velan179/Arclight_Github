import { Router } from 'express';
import verificationController from '../controllers/verificationController.js';

const router = Router();

router.post('/', (req, res) => verificationController.runVerification(req, res));
router.post('/:runId', (req, res) => verificationController.runVerification(req, res));
router.get('/:runId', (req, res) => verificationController.getByRunId(req, res));

export default router;
