/**
 * server.js — Entry point.
 * Connects to MongoDB (non-fatal) then starts the HTTP server.
 */

import app from './app.js';
import { connectDB } from './config/db.js';
import config from './config/env.js';

async function start() {
  // Attempt DB connection — non-fatal; /api/health works without it
  await connectDB();

  app.listen(config.port, () => {
    console.log('');
    console.log('🚀 ResolveFlow API Server');
    console.log(`   Env:     ${config.nodeEnv}`);
    console.log(`   Port:    ${config.port}`);
    console.log(`   Health:  http://localhost:${config.port}/api/health`);
    console.log('');
  });
}

start();
