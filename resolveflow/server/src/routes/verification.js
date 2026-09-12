/**
 * verification.js — Verification routes stub.
 *
 * Frozen API contract:
 *   POST /api/verification/:runId
 *   GET  /api/verification/:runId
 *
 * Primary owner: Member 4 (feature/member-4-actions)
 * Implementation lives in: resolveflow/server/src/services/verification/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// POST /api/verification/:runId
router.post('/:runId', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/verification/:runId
router.get('/:runId', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
