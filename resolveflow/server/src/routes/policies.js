import { Router } from 'express';
import policyController from '../controllers/policyController.js';

const router = Router();

router.get('/', (req, res) => policyController.getAll(req, res));
router.post('/check-eligibility', (req, res) => policyController.checkEligibility(req, res));

export default router;
