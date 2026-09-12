/**
 * policies.js — Policy routes stub.
 *
 * Frozen API contract:
 *   GET /api/policies
 *
 * Primary owner: Member 3 (feature/member-3-enterprise)
 * Implementation lives in: resolveflow/server/src/services/policy/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// GET /api/policies
router.get('/', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
