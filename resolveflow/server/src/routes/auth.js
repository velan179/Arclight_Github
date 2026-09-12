import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', (req, res) => authController.me(req, res));

export default router;
