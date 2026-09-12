import { Router } from 'express';
import caseController from '../controllers/caseController.js';

const router = Router();

router.get('/', (req, res) => caseController.list(req, res));
router.post('/', (req, res) => caseController.create(req, res));
router.get('/:id', (req, res) => caseController.getById(req, res));

export default router;
