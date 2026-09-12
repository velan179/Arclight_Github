/**
 * health.js — GET /api/health
 * No authentication required. Safe to call before MongoDB is ready.
 */

import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import { getConnectionState } from '../config/db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let version = '1.0.0';
try {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf8')
  );
  version = pkg.version ?? version;
} catch {
  // fine — default used
}

router.get('/', (_req, res) => {
  const db = getConnectionState();
  return sendSuccess(
    res,
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'resolveflow-api',
      version,
      database: {
        connected: db.isConnected,
        readyState: db.readyState,
      },
    },
    'ResolveFlow API is running'
  );
});

export default router;
