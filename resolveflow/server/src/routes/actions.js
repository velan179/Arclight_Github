/**
 * actions.js — Action execution routes stub.
 *
 * Frozen API contract:
 *   POST /api/actions/refund
 *   POST /api/actions/replacement
 *   POST /api/actions/cancel
 *
 * Primary owner: Member 4 (feature/member-4-actions)
 * Implementation lives in: resolveflow/server/src/services/actions/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// POST /api/actions/refund
router.post('/refund', (_req, res) => NOT_IMPLEMENTED(res));

// POST /api/actions/replacement
router.post('/replacement', (_req, res) => NOT_IMPLEMENTED(res));

// POST /api/actions/cancel
router.post('/cancel', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
