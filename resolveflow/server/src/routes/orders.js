/**
 * orders.js — Order routes stub.
 *
 * Frozen API contract:
 *   GET /api/orders/:id
 *
 * Primary owner: Member 3 (feature/member-3-enterprise)
 * Implementation lives in: resolveflow/server/src/services/order/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// GET /api/orders/:id
router.get('/:id', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
