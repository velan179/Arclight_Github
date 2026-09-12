/**
 * cases.js — Case management routes stub.
 *
 * Frozen API contract:
 *   POST /api/cases
 *   GET  /api/cases
 *   GET  /api/cases/:id
 *
 * Implementation: shared infrastructure — coordinate with team lead before modifying.
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// POST /api/cases
router.post('/', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/cases
router.get('/', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/cases/:id
router.get('/:id', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
