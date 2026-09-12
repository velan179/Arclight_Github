/**
 * inventory.js — Inventory routes stub.
 *
 * Frozen API contract:
 *   GET /api/inventory/:productId
 *
 * Primary owner: Member 3 (feature/member-3-enterprise)
 * Implementation lives in: resolveflow/server/src/services/inventory/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// GET /api/inventory/:productId
router.get('/:productId', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
