/**
 * agent.js — Agent routes stub.
 *
 * Frozen API contract:
 *   POST /api/agent/run
 *   GET  /api/agent/runs/:id
 *   GET  /api/agent/runs/:id/events
 *
 * Primary owner: Member 2 (feature/member-2-agent)
 * Implementation lives in: resolveflow/server/src/services/agent/
 */

import { Router } from 'express';
import { sendError } from '../utils/response.js';

const router = Router();

const NOT_IMPLEMENTED = (res) =>
  sendError(res, 'NOT_IMPLEMENTED', 'This endpoint is not yet implemented', 501);

// POST /api/agent/run
router.post('/run', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/agent/runs/:id
router.get('/runs/:id', (_req, res) => NOT_IMPLEMENTED(res));

// GET /api/agent/runs/:id/events
router.get('/runs/:id/events', (_req, res) => NOT_IMPLEMENTED(res));

export default router;
