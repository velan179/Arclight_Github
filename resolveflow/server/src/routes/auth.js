/**
 * auth.js — Authentication routes stub.
 *
 * Frozen API contract:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *
 * Implementation: shared infrastructure — coordinate with team lead before modifying.
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// POST /api/auth/register
router.post('/register', (_req, res) => NOT_IMPLEMENTED(res));

// POST /api/auth/login
router.post('/login', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/auth/me
router.get('/me', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
